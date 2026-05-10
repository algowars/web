import ProblemNotFound from "@/features/problem/problem-not-found/problem-not-found";
import { routerConfig } from "@/router-config";

export default function NotFound() {
  return (
    <ProblemNotFound
      breadcrumbs={[
        { url: routerConfig.home.path, name: "Home" },
        { url: routerConfig.problems.path, name: "Problems" },
      ]}
    />
  );
}
