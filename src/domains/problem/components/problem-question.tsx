import { Problem } from "../models/problem";

type ProblemQuestionProps = {
  problem: Problem;
};

export const ProblemQuestion = ({ problem }: ProblemQuestionProps) => {
  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {problem.title}
      </h2>
    </div>
  );
};
