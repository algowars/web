import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { routerConfig } from "@/shared/router-config";

type ProblemActionsProps = React.HTMLAttributes<HTMLUListElement> & {
  slug: string;
};

export const WorkspaceActions = ({ slug, ...props }: ProblemActionsProps) => {
  return (
    <ul {...props} className={cn("flex items-center gap-2", props.className)}>
      <li>
        <Button
          className="w-24"
          data-cy="submit-btn"
          //   onClick={handleSubmit}
          //   disabled={isActionDisabled}
        >
          {/* {!isAuthenticated && <Lock size={14} data-testid="lock-icon" />}
          {submitSubmissionMutation.isPending ? "Running..." : "Submit"} */}
          Submit
        </Button>
      </li>
      <li>
        <a
          href={routerConfig.problemSubmissions.execute({ slug })}
          className={cn(buttonVariants({ variant: "ghost" }))}
          data-cy="view-submissions-btn"
        >
          View Submissions
        </a>
      </li>
    </ul>
  );
};
