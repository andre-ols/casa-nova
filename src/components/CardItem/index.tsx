import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Badge } from "../Badge";

export const CardItem: FC<{
  id: string;
  title: string;
  category: "Cozinha" | "Sala" | "Quarto" | "Banheiro";
  image: string;
  status: "Disponível" | "Indisponível";
  giftedBy?: string[];
}> = async ({ title, image, giftedBy, status, id }) => {
  return (
    <Link
      href={`/presentes/${id}`}
      className="rounded-2xl px-5 py-4 max-w-[400px] w-full bg-zinc-200 text-black flex gap-4 shadow-md"
    >
      <Image
        className="w-1/2 h-48 object-contain rounded-lg"
        src={image}
        alt={title}
        width={200}
        height={200}
      />
      <div className="flex flex-col justify-between items-start">
        <h3 className="text-2xl font-semibold border-none">{title}</h3>

        <div className="flex flex-col gap-4">
          <Badge
            text={status}
            type={status === "Disponível" ? "success" : "warning"}
          />

          {status === "Indisponível" && (
            <>
              <span className="text-sm text-zinc-900 font-semibold">
                🎁 {giftedBy}
              </span>
            </>
          )}
        </div>

        <span className="text-sm text-end text-gray-800 cursor-pointer">
          Ver detalhes
        </span>
      </div>
    </Link>
  );
};
