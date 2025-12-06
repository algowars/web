import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateProblemStore } from "./create-problem-store";
import { useCreateProblem } from "./api/create-problem";
import { toast } from "sonner";

type CreateProblemFooterProps = {
  accessToken?: string;
};

export default function CreateProblemFooter({
  accessToken,
}: CreateProblemFooterProps) {
  const createProblemModel = useCreateProblemStore((s) => s.createProblem);
  const mutation = useCreateProblem();

  const handleCreate = async () => {
    const problemData = createProblemModel();

    mutation.mutate(
      { data: problemData, accessToken: accessToken ?? "" },
      {
        onError: (error: any) => {
          const errors = error.response?.data?.errors;

          if (errors && Array.isArray(errors)) {
            errors.forEach((e: any) => {
              toast.error(e.Field, { description: e.Message });
            });
          } else {
            toast.error("Error", {
              description: error.message || "An error occurred",
            });
          }
        },
        onSuccess: () => {
          toast.success("Problem created successfully!");
        },
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
