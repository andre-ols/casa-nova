import { firestore } from "@/firebase/config";
import { GiftItem } from "@/types/GiftItem";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // get id
  const { id } = params;

  const data = await getDoc(doc(collection(firestore, "gifts"), id));

  const item = data.data() as GiftItem;

  item.id = data.id;

  return NextResponse.json(item);
}

// send gift

export async function POST(req: NextRequest) {
  const { id, giftedBy } = await req.json();

  console.log("id", id);
  console.log("giftedBy", giftedBy);
  const data = await getDoc(doc(collection(firestore, "gifts"), id));

  const item = data.data() as GiftItem;

  if (item.status === "Indisponível") {
    return new Response("Gift already sent", { status: 400 });
  }

  await updateDoc(doc(collection(firestore, "gifts"), id), {
    status: "Indisponível",
    giftedBy: giftedBy,
  });

  return NextResponse.json({ message: "Gift sent" });
}
