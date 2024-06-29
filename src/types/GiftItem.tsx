export type GiftItem = {
  id: string;
  name: string;
  description: string;
  status: "Disponível" | "Indisponível";
  category: "Cozinha" | "Sala" | "Quarto" | "Banheiro";
  images: string[];
  frontImage: string;
  giftedBy?: string[];
  giftDate?: string;
  personForGift: number;
};
