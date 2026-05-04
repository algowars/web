import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ProblemSubmission } from "../models/problem-submission";

type SubmissionCardProps = {
  submission: ProblemSubmission;
};

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  if (!submission.createdBy) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          {submission.createdBy.imageUrl && (
            <AvatarImage
              src={submission.createdBy.imageUrl}
              alt={submission.createdBy.username}
            />
          )}
          <AvatarFallback>{submission.createdBy.username}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{submission.createdBy.username}</h3>
          <p className="text-muted-foreground text-sm">
            {dayjs(submission.createdOn).format("MMM DD, YYYY")}
          </p>
        </div>
        <p className="ml-auto">{submission.status}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <SyntaxHighlighter
          language="javascript"
          style={oneDark}
          customStyle={{ borderRadius: "0.375rem", fontSize: "0.875rem" }}
        >
          {submission.code}
        </SyntaxHighlighter>
        <ul className="flex items-center gap-5 text-sm">
          <li>
            Language: <span>{submission.language}</span>
          </li>
          <li>
            Runtime Ms: <span>{submission.runTimeMs}</span>
          </li>
          <li>
            Memory Kb: <span>{submission.memoryKb}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
