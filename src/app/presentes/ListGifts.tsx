"use client";
import { CardItem, CardItemLoading } from "@/components/CardItem";
import { GiftItem } from "@/types/GiftItem";
import { useQuery } from "@tanstack/react-query";

const useQueryGifts = () => {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: async () => {
      const response = await fetch(`/api/presentes`);
      const data = await response.json();
      return data as {
        items: GiftItem[];
        nextPageToken: string;
        previousPageToken: string;
      };
    },
  });
};

export function ListGifts() {
  const { data, isLoading } = useQueryGifts();

  return (
    <>
      {data?.items.map((item: GiftItem) => (
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

      {isLoading && <CardItemLoading />}
    </>
  );
}
