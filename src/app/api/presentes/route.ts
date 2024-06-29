import { firestore, storage } from "@/firebase/config";
import { GiftItem } from "@/types/GiftItem";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const querySnapshot = await getDocs(collection(firestore, "gifts"));

  const items: GiftItem[] = [];

  querySnapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      ...doc.data(),
    } as GiftItem);
  });

  await Promise.all(
    items.map(async (item) => {
      const frontImageRef = ref(storage, item.frontImage);
      const frontImageUrl = await getDownloadURL(frontImageRef);

      item.frontImage = frontImageUrl;

      const imagesRef = item.images.map((image) => ref(storage, image));

      const imagesUrl = await Promise.all(
        imagesRef.map((imageRef) => getDownloadURL(imageRef))
      );

      item.images = imagesUrl;
    })
  );

  console.log(items);

  return NextResponse.json(items);
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

  // // getDownloadURL
  // const frontImageUrl = await getDownloadURL(frontImageStorageRef);

  // console.log(frontImageUrl);

  const gift: Omit<GiftItem, "id"> = {
    category: data.get("category") as GiftItem["category"],
    description: data.get("description") as string,
    frontImage: frontImagePath,
    giftedBy: [],
    images: imagesPath,
    name: data.get("name") as string,
    personForGift: 1,
    status: "Disponível",
  };

  const response = await addDoc(collection(firestore, "gifts"), gift);

  return NextResponse.json(response);
}
