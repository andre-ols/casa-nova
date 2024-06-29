"use client";
import { CardItem } from "@/components/CardItem";
import { GiftItem } from "@/types/GiftItem";
import { useQuery } from "@tanstack/react-query";

const useQueryGifts = () => {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/presentes`);
      const data = await response.json();
      return data as GiftItem[];
    },
  });
};

export default function ListGifts() {
  const { data, isLoading } = useQueryGifts();

  if (isLoading) return <div>Loading...</div>;

  console.log(data);

  return (
    <div className="flex bg-gray-100 flex-col items-center p-5 gap-5 w-full">
      {data?.map((item) => (
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
