import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Badge } from "../Badge";
import { Skeleton } from "../ui/skeleton";

export const CardItem: FC<{
  id: string;
  title: string;
  category: "Cozinha" | "Sala" | "Quarto" | "Banheiro";
  image: string;
  status: "Disponível" | "Indisponível";
  giftedBy?: string[];
}> = ({ title, image, giftedBy, status, id }) => {
  return (
    <Link
      href={`/presentes/${id}`}
      className="rounded-2xl px-5 py-4 max-w-[400px] w-full bg-zinc-200 text-black flex items-center gap-4 shadow-md"
    >
      <Image
        className="w-1/2 h-28 object-contain rounded-lg"
        src={image}
        alt={title}
        width={200}
        height={200}
        priority
      />

      <div className="flex flex-col justify-between items-start h-full">
        <h3 className="text-lg font-semibold border-none">{title}</h3>

        <div className="flex flex-col gap-4">
          <Badge
            text={status}
            type={status === "Disponível" ? "success" : "warning"}
          />
        </div>
        {status === "Indisponível" ? (
          <span className="text-sm text-zinc-900 font-semibold">
            🎁 {giftedBy}
          </span>
        ) : (
          <span className="text-sm text-end text-gray-800 cursor-pointer">
            Ver detalhes
          </span>
        )}
      </div>
    </Link>
  );
};

export const CardItemLoading: FC = () => {
  return (
    <div className="rounded-2xl px-5 py-4 max-w-[400px] w-full bg-zinc-200 text-black flex items-center gap-4 shadow-md">
      <Skeleton className="w-1/2 h-28 rounded-lg" />

      <div className="flex w-1/2 flex-col justify-between items-start h-full">
        <Skeleton className="w-full h-4" />

        <Skeleton className="w-1/2 h-4" />

        <Skeleton className="w-full h-4" />
      </div>
    </div>
  );
};
