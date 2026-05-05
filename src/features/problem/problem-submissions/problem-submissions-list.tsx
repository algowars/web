import { ProblemSubmission } from "../models/problem-submission";
import SubmissionCard from "./submission-card";

type ProblemSubmissionsListProps = {
  submissions: ProblemSubmission[];
};

export default function ProblemSubmissionsList({
  submissions,
}: ProblemSubmissionsListProps) {
  return (
    <ul>
      {submissions.map((submission) => (
        <li key={submission.id}>
          <SubmissionCard submission={submission} />
        </li>
      ))}
    </ul>
  );
}
