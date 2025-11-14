import { Button } from "@/components/ui/button";
import React from "react";

type ProblemActionsProps = React.HTMLAttributes<HTMLUListElement>;

export default function ProblemActions(props: ProblemActionsProps) {
  return (
    <ul {...props}>
      <li>
        <Button className="w-28">Submit</Button>
      </li>
    </ul>
  );
}
