import type { Language } from "./language";

export type MessageKey = string;
export type Dictionaries = Record<Language, Record<string, string>>;
export type Params = Record<string, string | number>;
export interface PluralForms {
  one: string;
  few?: string;
  many?: string;
  other: string;
}

export const DICTIONARIES: Dictionaries = { en: {}, uk: {} };

export function translate(
  _language: Language,
  _key: MessageKey,
  _params?: Params,
  _dictionaries?: Dictionaries,
): string {
  throw new Error("not implemented");
}

export function plural(_language: Language, _count: number, _forms: PluralForms): string {
  throw new Error("not implemented");
}

export function translatePlural(
  _language: Language,
  _baseKey: string,
  _count: number,
  _params?: Params,
): string {
  throw new Error("not implemented");
}
