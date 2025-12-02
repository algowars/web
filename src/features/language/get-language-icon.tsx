const LANGUAGE_ICON_MAP: Record<string, string> = {
  c: "devicon-c-plain",
  "c++": "devicon-cplusplus-plain",
  "c#": "devicon-csharp-plain",
  python: "devicon-python-plain",
  java: "devicon-java-plain",
  javascript: "devicon-javascript-plain",
  go: "devicon-go-plain",
  rust: "devicon-rust-plain",
  kotlin: "devicon-kotlin-plain",
  typescript: "devicon-typescript-plain",
  php: "devicon-php-plain",
  ruby: "devicon-ruby-plain",
  swift: "devicon-swift-plain",
};

export function getLanguageIconClass(languageName: string) {
  return LANGUAGE_ICON_MAP[languageName.toLowerCase()] ?? "devicon-code-plain";
}
