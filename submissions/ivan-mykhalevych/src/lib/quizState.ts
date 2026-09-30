import type { Question } from "./types";

export interface QuizState {
  questions: Question[];
  index: number;
  selected: number | null;
  answers: (number | null)[];
  finished: boolean;
}

export function initQuiz(questions: Question[]): QuizState {
  return {
    questions,
    index: 0,
    selected: null,
    answers: questions.map(() => null),
    finished: false,
  };
}

export function selectOption(state: QuizState, option: number): QuizState {
  if (state.finished || state.selected !== null) return state;
  const answers = [...state.answers];
  answers[state.index] = option;
  return { ...state, selected: option, answers };
}

export function nextQuestion(state: QuizState): QuizState {
  if (state.finished || state.selected === null) return state;
  if (state.index === state.questions.length - 1) return { ...state, finished: true };
  return { ...state, index: state.index + 1, selected: null };
}

export function restartQuiz(state: QuizState): QuizState {
  return initQuiz(state.questions);
}
