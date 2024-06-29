import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ListGifts } from "./ListGifts";

export default async function ListGiftsPage({ searchParams }) {
  const previousPageToken = searchParams.previousPageToken || "";
  const nextPageToken = searchParams.nextPageToken || "";

  const queryClient = new QueryClient();

  console.log(process.env["BACKEND_URL"]);

  await queryClient.prefetchQuery({
    queryKey: [
      "gifts",
      {
        nextPageToken: nextPageToken ? nextPageToken : undefined,
        previousPageToken: previousPageToken ? previousPageToken : undefined,
      },
    ],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env["BACKEND_URL"]}/api/presentes?nextPageToken=${nextPageToken}&previousPageToken=${previousPageToken}`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.log("error:", error);
        return [];
      }
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col items-center p-5 gap-5 w-full">
          <ListGifts />
        </div>
      </HydrationBoundary>
    </Suspense>
  );
}
