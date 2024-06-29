import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import salvadorImage from "../assets/conheca-salvador-e-se-apaixone-pela-capital-baiana.jpeg";
import "../firebase/config";

const Home: FC = () => {
  return (
    <main className="container mx-auto px-6 py-12 flex flex-col gap-3">
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-600">
          Chá de Casa Nova <br />
          <span className="text-2xl text-cyan-500">André e Letícia</span>
        </h2>
      </section>
      <Image
        src={salvadorImage}
        alt="Imagem de Salvador"
        width={600}
        height={400}
        className="rounded-lg shadow-md"
      />
      <section className="text-center">
        <p className="text-gray-600 mb-8">
          Estamos começando uma nova trajetória juntos e queremos compartilhar
          esse momento especial com você. Estamos de mudança para a primeira
          capital do Brasil, Salvador.
          <br /> <br />
          Venha celebrar conosco e ajude-nos a montar nosso novo lar.
        </p>
      </section>

      {/* Clique para ver a lista de presentes */}
      <Link href="/presentes" className="w-full">
        <button className="bg-cyan-500 w-full text-white font-bold py-2 px-4 rounded-lg">
          Ver lista de presentes
        </button>
      </Link>
    </main>
  );
};

export default Home;
