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
