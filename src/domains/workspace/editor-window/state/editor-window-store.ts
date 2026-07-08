import { ReactNode } from "react";

export type EditorWindowTabNode = {
  component?: ReactNode;
  headerComponent?: ReactNode;
  icon?: ReactNode;
  key?: string;
  children?: EditorWindowTabNode[];
  name?: string;
  orientation?: "horizontal" | "vertical";
  defaultSize?: number;
};
