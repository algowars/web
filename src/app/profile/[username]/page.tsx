import { preloadData } from "@/app/problems/[slug]/page";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { getProblemBySlugQueryOptions } from "@/features/problems/api/get-problem-by-slug";
import { getProfileQueryOptions } from "@/features/profile/api/get-profile";
import Profile from "@/features/profile/profile";
import ProfileLayout from "@/features/profile/profile-layout";
import { routerConfig } from "@/router-config";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

const prefloadData = async (username: string) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getProblemBySlugQueryOptions(username)),
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
      <ProfileLayout profile={profile} />
    </HydrationBoundary>
  );
}
