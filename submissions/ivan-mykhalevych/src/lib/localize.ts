import type { Language } from "./language";
import type { Question } from "./types";

export interface QuestionTranslation {
  text: string;
  options: [string, string, string, string];
  explanation: string;
}

export function localizeQuestion(
  _question: Question,
  _language: Language,
  _translations?: Record<string, QuestionTranslation>,
): Question {
  throw new Error("not implemented");
}

export function topicLabel(_language: Language, _topic: string): string {
  throw new Error("not implemented");
}
