export const LANGUAGES = ["en", "uk"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_KEY = "java-trainer-language";
export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_NAMES: Record<Language, string> = { en: "English", uk: "Українська" };

export function detectLanguage(_preferred: readonly string[]): Language {
  throw new Error("not implemented");
}

export function parseLanguage(_raw: string | null): Language | null {
  throw new Error("not implemented");
}

export function resolveLanguage(_storedText: string | null, _preferred: readonly string[]): Language {
  throw new Error("not implemented");
}
