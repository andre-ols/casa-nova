"use client";
import { CardItem } from "@/components/CardItem";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GiftItem } from "@/types/GiftItem";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const useQueryGifts = (nextPageToken: string, previousPageToken: string) => {
  return useQuery({
    queryKey: [
      "gifts",
      {
        nextPageToken: nextPageToken ? nextPageToken : undefined,
        previousPageToken: previousPageToken ? previousPageToken : undefined,
      },
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/presentes?nextPageToken=${nextPageToken}&previousPageToken=${previousPageToken}`
      );
      const data = await response.json();
      return data;
    },
  });
};

export function ListGifts() {
  const previousPageToken = useSearchParams().get("previousPageToken") || "";
  const nextPageToken = useSearchParams().get("nextPageToken") || "";

  const { data } = useQueryGifts(nextPageToken, previousPageToken);

  const nextPage = () => {
    return `/presentes?nextPageToken=${data?.nextPageToken}`;
  };

  const previousPage = () => {
    return `/presentes?previousPageToken=${data?.previousPageToken}`;
  };
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`
                ${
                  data.previousPageToken
                    ? "bg-zinc-200"
                    : "bg-zinc-100 pointer-events-none"
                }
                `}
              href={previousPage()}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={`
                ${
                  data.nextPageToken
                    ? "bg-zinc-200"
                    : "bg-zinc-100 pointer-events-none"
                }
                `}
              href={nextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
