import { firestore, storage } from "@/firebase/config";
import { GiftItem } from "@/types/GiftItem";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  endBefore,
  getCountFromServer,
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
  // Pagination
  const url = new URL(req.url);
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;
  const nextPageToken = url.searchParams.get("nextPageToken");
  const previousPageToken = url.searchParams.get("previousPageToken");

  console.log("pageSize backend:", pageSize);
  console.log("nextPageToken backend:", nextPageToken);

  // Query order 'Disponível' first and then 'Indisponível'
  let q = query(
    collection(firestore, "gifts"),
    orderBy("status"),
    limit(pageSize)
  );

  // Apply pagination using the nextPageToken
  if (nextPageToken) {
    const currentDoc = await getDoc(
      doc(collection(firestore, "gifts"), nextPageToken)
    );

    if (currentDoc.exists()) {
      q = query(
        collection(firestore, "gifts"),
        orderBy("status"),
        limit(pageSize),
        startAfter(currentDoc)
      );
    }
  }

  if (previousPageToken) {
    const current = await getDoc(
      doc(collection(firestore, "gifts"), previousPageToken)
    );

    if (current.exists()) {
      q = query(
        collection(firestore, "gifts"),
        orderBy("status"),
        limit(pageSize),
        endBefore(current)
      );
    }
  }

  const querySnapshot = await getDocs(q);

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  const lastDocId = lastDoc ? lastDoc.id : null;
  const firstDoc = querySnapshot.docs[0];
  const firstDocId = firstDoc ? firstDoc.id : null;

  const [totalAfter, totalBefore] = await Promise.all([
    getCountFromServer(
      query(
        collection(firestore, "gifts"),
        orderBy("status"),
        startAfter(lastDocId)
      )
    ),
    getCountFromServer(
      query(
        collection(firestore, "gifts"),
        orderBy("status"),
        endBefore(firstDocId)
      )
    ),
  ]);

  const totalAfterCount = totalAfter.data().count;
  const totalBeforeCount = totalBefore.data().count;

  if (querySnapshot.empty) {
    return new Response("No documents found", { status: 404 });
  }

  const items: GiftItem[] = [];

  querySnapshot.forEach((doc: DocumentData) => {
    items.push({
      id: doc.id,
      ...doc.data(),
    } as GiftItem);
  });

  console.log("items:", items);

  console.log("nextPageToken:", nextPageToken);

  return NextResponse.json({
    items,
    nextPageToken: totalAfterCount > 0 ? lastDocId : null,
    previousPageToken: totalBeforeCount > 0 ? firstDocId : null,
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
