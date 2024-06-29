import { CardItem } from "@/components/CardItem";
import { GiftItem } from "@/types/GiftItem";

export default async function ListGifts() {
  const response = await fetch("http://localhost:3000/api/presentes", {
    next: {
      revalidate: 1,
    },
  });
  const data = (await response.json()) as GiftItem[];

  console.log(data);

  return (
    <div className="flex bg-gray-100 flex-col items-center p-5 gap-5 w-full">
      {data.map((item) => (
        <CardItem
          category={item.category}
          id={item.id}
          image={item.frontImage}
          status={item.status}
          title={item.name}
          giftedBy={item.giftedBy}
          key={item.id}
        />
      ))}
    </div>
  );
}
