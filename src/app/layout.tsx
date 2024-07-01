import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/providers/react-query";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Header } from "../components/Header";
import "./globals.css";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chá de Casa Nova André e Letícia",
  description:
    "Estamos começando uma nova trajetória juntos e queremos compartilhar esse momento especial com você. Estamos de mudança para a primeira capital do Brasil, Salvador.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${roboto.className} min-h-screen bg-gray-100`}>
        <ReactQueryProvider>
          <div className="flex flex-col justify-center items-center container mx-auto px-6 py-4">
            <Header />

            <main className="flex justify-center w-full">{children}</main>
          </div>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
