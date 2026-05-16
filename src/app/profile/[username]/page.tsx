import { getProfileQueryOptions } from "@/features/profile/api/get-profile";
import ProfileLayout from "@/features/profile/profile-layout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

const preloadData = async (username: string) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getProfileQueryOptions(username)),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return {
    dehydratedState,
    queryClient,
  };
};

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;

  const { dehydratedState, queryClient } = await preloadData(username);

  const profile = queryClient.getQueryData(
    getProfileQueryOptions(username).queryKey
  );

  if (!profile) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileLayout profile={profile.profile} />
    </HydrationBoundary>
  );
}
