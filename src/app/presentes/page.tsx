import { CardItemLoading } from "@/components/CardItem";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ListGifts } from "./ListGifts";

export default async function ListGiftsPage() {
  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<CardItemLoading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col items-center p-5 gap-5 w-full">
          <ListGifts />
        </div>
      </HydrationBoundary>
    </Suspense>
  );
}
