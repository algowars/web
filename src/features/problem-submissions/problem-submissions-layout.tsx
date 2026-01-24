import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import { ProblemSubmission } from "../problem/models/problem-submission";

type ProblemSubmissionLayout = {
  problemSubmission: ProblemSubmission;
}

export default function ProblemSubmissionsLayout({ problemSubmission }: ProblemSubmissionLayout) {
  return  <SidebarLayout
        breadcrumbs={[
          {
            url: routerConfig.home.path,
            name: "Home",
          },
          {
            url: routerConfig.problems.path,
            name: "Problems",
          },
          {
            url: routerConfig.problem.execute({ slug: problemSubmission.problem.slug }),
            name: problemSubmission.problem.title,
          },
        ]}
        defaultOpen={false}
      >
        <div className="h-full">
          <h1>HELLO WORLD</h1>
        </div>
      </SidebarLayout>
}
