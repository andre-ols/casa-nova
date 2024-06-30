import { firestore, storage } from "@/firebase/config";
import { GiftItem } from "@/types/GiftItem";
import {
  addDoc,
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;
  const nextPageToken = url.searchParams.get("nextPageToken");
  const previousPageToken = url.searchParams.get("previousPageToken");

  let q = query(
    collection(firestore, "gifts"),
    orderBy("status"),
    limit(pageSize)
  );

  if (nextPageToken) {
    const currentDoc = await getDoc(doc(firestore, "gifts", nextPageToken));

    if (currentDoc.exists()) {
      q = query(
        collection(firestore, "gifts"),
        orderBy("status"),
        startAfter(currentDoc),
        limit(pageSize)
      );
    }
  }

  if (previousPageToken) {
    const currentDoc = await getDoc(doc(firestore, "gifts", previousPageToken));

    if (currentDoc.exists()) {
      q = query(
        collection(firestore, "gifts"),
        orderBy("status"),
        endBefore(currentDoc),
        limit(pageSize)
      );
    }
  }

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return new Response("No documents found", { status: 404 });
  }

  const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  const firstDoc = querySnapshot.docs[0];
  const nextPageTokenResult = lastDoc ? lastDoc.id : null;
  const previousPageTokenResult = firstDoc ? firstDoc.id : null;

  console.log("nextPageTokenResult", nextPageTokenResult);
  console.log("previousPageTokenResult", previousPageTokenResult);

  return NextResponse.json({
    items,
    nextPageToken: nextPageTokenResult,
    previousPageToken: previousPageTokenResult,
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
