import { CodeEditor } from "@/components/code-editor/code-editor";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CreateProblemSetup } from "../models/create-problem-setup-model";
import CreateProblemSetupCardInfoInitialCode from "./create-problem-setup-card-info-initial-code";

type CreateProblemSetupCardInfo = {
  setup: CreateProblemSetup;
  positionalSetupIndex: number;
};

export default function CreateProblemSetupCardInfo({
  setup,
  positionalSetupIndex,
}: CreateProblemSetupCardInfo) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="overview">
        <AccordionTrigger className="text-sm font-medium">
          More Info
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground">
          <CreateProblemSetupCardInfoInitialCode
            setup={setup}
            positionalSetupIndex={positionalSetupIndex}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
