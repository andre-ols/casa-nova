import { Badge } from "@/components/Badge";
import { Carousel } from "@/components/Carrossel";
import { Gift } from "@/components/Gift";

export default async function GiftItem({ params }: { params: { id: string } }) {
  const response = await fetch(
    `http://localhost:3000/api/presentes/${params.id}`,
    {
      next: {
        revalidate: 1,
      },
    }
  );
  const result = await response.json();
  console.log(result);

  const data = result;
  return (
    <div className="h-full flex justify-center items-center overflow-auto">
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
