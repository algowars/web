export function lexicalToMarkdown(serializedState: any): string {
  const editorState = serializedState;
  const nodes = editorState.root?.children || [];
  const text = nodes.map((node: any) => node.text || "").join("\n\n");
  return text;
}
