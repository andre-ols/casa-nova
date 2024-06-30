import { firestore, storage } from "@/firebase/config";
import { GiftItem } from "@/types/GiftItem";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  let q = query(collection(firestore, "gifts"), orderBy("status"));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return new Response("No documents found", { status: 404 });
  }

  const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({
    items,
  });
}

export async function POST(req: NextRequest) {
  const data = await req.formData();

  const frontImage = data.get("frontImage") as File;

  if (!frontImage) {
    return new Response("Front image is required", { status: 400 });
  }
  // upload image to storage

  const frontImagePath = `gifts/${frontImage.name} + ${Date.now()}`;
  const frontImageStorageRef = ref(storage, frontImagePath);

  await uploadBytes(frontImageStorageRef, frontImage);

  const frontImageUrl = await getDownloadURL(frontImageStorageRef);

  const images = data.getAll("images") as File[];

  const imagesPath = images.map((image) => {
    const imagePath = `gifts/${image.name} + ${Date.now()}`;
    return imagePath;
  });

  const imagesStorageRef = imagesPath.map((path) => ref(storage, path));

  await Promise.all(
    images.map((image, index) => {
      return uploadBytes(imagesStorageRef[index], image);
    })
  );

  const imagesUrl = await Promise.all(
    imagesStorageRef.map((storageRef) => getDownloadURL(storageRef))
  );

  const gift: Omit<GiftItem, "id"> = {
    category: data.get("category") as GiftItem["category"],
    description: data.get("description") as string,
    frontImage: frontImageUrl,
    giftedBy: [],
    images: imagesUrl,
    name: data.get("name") as string,
    personForGift: 1,
    status: "Disponível",
  };

  const response = await addDoc(collection(firestore, "gifts"), gift);

  return NextResponse.json(response);
}
