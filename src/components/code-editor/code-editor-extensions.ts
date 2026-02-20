import { javascript } from "@codemirror/lang-javascript";
import { Extension } from "@uiw/react-codemirror";

export const defaultCodeEditorExtensions: Extension[] = [javascript()];

/**
 * Normalize a DB language name to a lookup key.
 */
function normalize(lang?: string) {
  if (!lang) return "";
  return lang.toString().trim().toLowerCase();
}

/**
 * Dynamically load language extensions for CodeMirror.
 * Returns an array of extensions (can be empty if no loader found).
 *
 * Examples of accepted language input:
 *  "JavaScript", "TypeScript", "python", "C++", "c", "go", "java", "rust", "php", "sql", "ruby", "kotlin"
 *
 * For languages without a dedicated CM6 package we fall back to no extension.
 */
export async function loadLanguageExtensions(
  lang?: string
): Promise<Extension[]> {
  const key = normalize(lang);

  const loaders: Record<string, () => Promise<Extension | Extension[] | null>> =
    {
      // JS/TS
      javascript: async () =>
        (await import("@codemirror/lang-javascript")).javascript(),
      js: async () =>
        (await import("@codemirror/lang-javascript")).javascript(),
      typescript: async () =>
        (await import("@codemirror/lang-javascript")).javascript({
          typescript: true,
        }),
      ts: async () =>
        (await import("@codemirror/lang-javascript")).javascript({
          typescript: true,
        }),

      // Python
      python: async () => (await import("@codemirror/lang-python")).python(),
      py: async () => (await import("@codemirror/lang-python")).python(),
      // Fallbacks / legacy modes could be added here if you include legacy packages
      // e.g. lua, visual basic, etc. For now return null so editor uses plain text.
    };

  const loader =
    loaders[key] ||
    // allow some common aliasing
    loaders[
      {
        "visual basic": "vb",
        vb: undefined,
        "javascript (typescript)": "typescript",
      }[key] as string
    ];

  if (!loader) return [];

  try {
    const ext = await loader();
    if (!ext) return [];
    // Normalise to array
    return Array.isArray(ext) ? ext : [ext];
  } catch {
    return [];
  }
}
