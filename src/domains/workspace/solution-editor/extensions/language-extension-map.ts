import type { Extension } from "@uiw/react-codemirror";

export type JavaScriptLanguageOptions = {
  jsx?: boolean;
  typescript?: boolean;
};

export type LanguageExtensionOptions = {
  javascript?: JavaScriptLanguageOptions;
};

const languageExtensionLoaders: Record<
  number,
  (options?: LanguageExtensionOptions) => Promise<Extension>
> = {
  0: async (options) => {
    const { javascript } = await import("@codemirror/lang-javascript");
    const javascriptOptions = options?.javascript;

    return javascript({
      jsx: javascriptOptions?.jsx ?? true,
      typescript: javascriptOptions?.typescript,
    });
  },
};

const languageExtensionLoadersByName: Record<string, () => Promise<Extension>> =
  {
    javascript: async () => {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript({ jsx: true });
    },
    typescript: async () => {
      const { javascript } = await import("@codemirror/lang-javascript");
      return javascript({ jsx: true, typescript: true });
    },
    python: async () => {
      const { python } = await import("@codemirror/lang-python");
      return python();
    },
  };

const languageExtensionCache = new Map<string, Promise<Extension[]>>();

const getCacheKey = (languageId: number, options?: LanguageExtensionOptions) =>
  `${languageId}:${JSON.stringify(options ?? {})}`;

export const getLanguageExtensionsById = async (
  languageId: number,
  options?: LanguageExtensionOptions
): Promise<Extension[]> => {
  const loader = languageExtensionLoaders[languageId];
  const cacheKey = getCacheKey(languageId, options);

  if (!loader) {
    return [];
  }

  const cached = languageExtensionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const loadPromise = loader(options).then((extension) => [extension]);
  languageExtensionCache.set(cacheKey, loadPromise);

  return loadPromise;
};

export const registerLanguageExtensionLoader = (
  languageId: number,
  loader: (options?: LanguageExtensionOptions) => Promise<Extension>
) => {
  languageExtensionLoaders[languageId] = loader;
  languageExtensionCache.clear();
};

const languageExtensionByNameCache = new Map<string, Promise<Extension[]>>();

export const getLanguageExtensionsByName = async (
  languageName: string
): Promise<Extension[]> => {
  const key = languageName.trim().toLowerCase();
  const loader = languageExtensionLoadersByName[key];

  if (!loader) {
    return [];
  }

  const cached = languageExtensionByNameCache.get(key);
  if (cached) {
    return cached;
  }

  const loadPromise = loader().then((extension) => [extension]);
  languageExtensionByNameCache.set(key, loadPromise);

  return loadPromise;
};
