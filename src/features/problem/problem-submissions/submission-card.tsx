import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { ProblemSubmission } from "../models/problem-submission";
import SubmissionStatusBadge from "@/features/submission/submissions-status/submission-status-badge";
import CodeBlock from "@/components/code-block/code-block";

type SubmissionCardProps = {
  submission: ProblemSubmission;
};

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  if (!submission.createdBy) {
    return null;
  }

  return (
    <Card data-cy="submission-card">
      <CardHeader className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={submission.createdBy.imageUrl}
            fallbackSrc="/default-pfp.png"
            alt={submission.createdBy.username}
          />
          <AvatarFallback>{submission.createdBy.username}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{submission.createdBy.username}</h3>
          <p className="text-muted-foreground text-sm">
            {dayjs(submission.createdOn).format("MMM DD, YYYY")}
          </p>
        </div>
        <SubmissionStatusBadge status={submission.status} className="ml-auto" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CodeBlock language={submission.language.toLowerCase()}>
          {submission.code}
        </CodeBlock>
        <ul className="flex items-center gap-5 text-sm">
          <li>
            Language:{" "}
            <span className="text-muted-foreground">
              {submission.language} - {submission.languageVersion}
            </span>
          </li>
          <li>
            Runtime:{" "}
            <span className="text-muted-foreground">
              {submission.runtimeMs} Ms
            </span>
          </li>
          <li>
            Memory:{" "}
            <span className="text-muted-foreground">
              {submission.memoryKb} Kb
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
