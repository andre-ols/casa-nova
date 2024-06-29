import { firestore, storage } from "@/firebase/config";
import { GiftItem } from "@/types/GiftItem";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // get id
  const { id } = params;

  console.log("id", id);

  const data = await getDoc(doc(collection(firestore, "gifts"), id));

  const item = data.data() as GiftItem;

  console.log(item);

  const images = await Promise.all(
    item.images.map(async (image) => {
      const imageUrl = await getDownloadURL(ref(storage, image));
      return imageUrl;
    })
  );

  item.images = images;

  item.id = data.id;

  console.log(item);

  return NextResponse.json(item);
}

// send gift

export async function POST(req: NextRequest) {
  const { id, giftedBy } = await req.json();

  console.log("id", id);
  console.log("giftedBy", giftedBy);
  const data = await getDoc(doc(collection(firestore, "gifts"), id));

  const item = data.data() as GiftItem;

  console.log(item);
  if (item.status === "Indisponível") {
    return new Response("Gift already sent", { status: 400 });
  }

  await updateDoc(doc(collection(firestore, "gifts"), id), {
    status: "Indisponível",
    giftedBy: giftedBy,
  });

  return NextResponse.json({ message: "Gift sent" });
}
