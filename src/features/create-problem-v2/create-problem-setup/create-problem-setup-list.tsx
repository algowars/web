import { useCreateProblemStore } from "../create-problem-store";
import CreateProblemSetupCard from "./create-problem-setup-card";

export default function CreateProblemSetupList() {
  const setups = useCreateProblemStore((s) => s.setups);

  return (
    <ul className="flex flex-col gap-4">
      {setups.map((setup, i) => (
        <li key={setup.languageVersionIds.join("-")}>
          <CreateProblemSetupCard setup={setup} index={i} />
        </li>
      ))}
    </ul>
  );
}
