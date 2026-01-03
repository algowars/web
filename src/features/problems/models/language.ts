export interface Language {
  id: number;
  name: string;
  versions: LanguageVersion[];
}

export interface LanguageVersion {
  id: number;
  version: string;
  initialCode?: string;
}
