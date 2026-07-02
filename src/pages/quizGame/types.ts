export interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface QuizListItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  questions_count?: number;
}

export interface Quiz extends QuizListItem {
  questions: Question[];
}
