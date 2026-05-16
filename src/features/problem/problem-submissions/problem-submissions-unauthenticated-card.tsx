import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProblemSubmissionsUnauthenticatedCard(
  props: React.ComponentProps<"div">
) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Solutions</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          You must log in to see the solutions.
        </p>
      </CardContent>
    </Card>
  );
}
