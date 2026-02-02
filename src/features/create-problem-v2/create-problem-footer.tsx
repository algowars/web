"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProblemStore } from "./create-problem-store";
import { useCreateProblem } from "./api/create-problem";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { routerConfig } from "@/router-config";
import { useRouter } from "next/navigation";

type CreateProblemFooterProps = {
  accessToken?: string;
};

export default function CreateProblemFooter({
  accessToken,
}: CreateProblemFooterProps) {
  const createProblemModel = useCreateProblemStore((s) => s.createProblem);
  const mutation = useCreateProblem();
  const router = useRouter();

  const handleCreate = async () => {
    const problemData = createProblemModel();

    mutation.mutate(
      { data: problemData, accessToken: accessToken ?? "" },
      {
        onSuccess: () => {
          toast.success("Problem created successfully!");
          router.push(routerConfig.problemManagement.path);
        },
        onError: (error: ApiError) => {
          toast.error("Error creating problem", {
            description: error.message
          })
        }
      }
    );
  };

  return (
    <footer>
      <Card>
        <CardContent className="flex gap-3">
          <Button type="button" variant="secondary" className="ml-auto">
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={mutation.isPending}
          >
            Create Problem
          </Button>
        </CardContent>
      </Card>
    </footer>
  );
}
