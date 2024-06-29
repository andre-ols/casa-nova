"use client";
import { Badge } from "@/components/Badge";
import { Carousel } from "@/components/Carrossel";
import { Gift } from "@/components/Gift";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const useQueryGift = (id: string) => {
  return useQuery({
    queryKey: ["gifts", id],
    queryFn: async () => {
      const response = await fetch(`/api/presentes/${id}`);
      const data = await response.json();
      return data;
    },
  });
};

export default function GiftItem({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQueryGift(params.id);
  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center overflow-auto">
        <div
          id="container"
          className="max-w-[400px] w-full h-full flex flex-col items-center p-5 justify-center gap-5"
        >
          <Skeleton className="w-full h-[400px] bg-zinc-300" />

          <div className="flex xl:h-[500px] max-w-[600px] flex-col items-center justify-between w-full gap-5">
            <header className="flex justify-between items-center w-full px-2">
              <Skeleton className="h-8 w-2/3 bg-zinc-200" />
              <Skeleton className="h-8 w-1/4 bg-zinc-200" />
            </header>

            <div className="bg-zinc-300 rounded-xl p-5 w-full h-full shadow-sm">
              <Skeleton className="h-24 w-full bg-zinc-200" />
            </div>
          </div>

          <div className="w-full h-20">
            <Skeleton className="w-full h-20" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="h-full w-full flex justify-center items-center overflow-auto">
      <div
        id="container"
        className="max-w-[400px] w-full h-full flex flex-col items-center p-5 justify-center gap-5"
      >
        <Carousel images={data.images} />

        <div className="flex xl:h-[500px] max-w-[600px] flex-col items-center justify-between w-full gap-5">
          <header className="flex justify-between items-center w-full px-2">
            <h1 className="text-2xl font-bold text-zinc-700">{data.name}</h1>
            <Badge
              text={data.status}
              type={data.status === "Disponível" ? "success" : "warning"}
            />
          </header>
          {data.status === "Indisponível" && (
            <div className="bg-zinc-300 rounded-xl p-5 w-full h-full shadow-sm">
              <span className="text-md text-zinc-900 font-semibold">
                🎁 Muito Obrigado, {data.giftedBy}
              </span>
            </div>
          )}
          <div className="bg-zinc-300 rounded-xl p-5 w-full h-full shadow-sm">
            <p className="text-black text-sm font-bold text-justify">
              {data.description}
            </p>
          </div>
        </div>

        {data.status === "Disponível" && <Gift id={data.id} />}
      </div>
    </div>
  );
}
