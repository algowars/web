import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

interface SolutionEditorProps extends ReactCodeMirrorProps {
  languageId?: number;
}

export default function SolutionEditor(props: SolutionEditorProps) {
  return <CodeMirror {...props} />;
}
