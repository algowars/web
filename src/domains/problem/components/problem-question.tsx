import { Problem } from "../models/problem";

type ProblemQuestionProps = {
  problem: Problem;
};

export const ProblemQuestion = ({ problem }: ProblemQuestionProps) => {
  return (
    <div className="p-4">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {problem.title}
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-4">{problem.question}</p>
    </div>
  );
};
