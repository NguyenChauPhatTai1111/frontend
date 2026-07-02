import { useState } from 'react';

import QuizList from './QuizList';
import QuizPlay from './QuizPlay';

export default function QuizGamePage() {
  const [quizId, setQuizId] = useState<number>();

  if (quizId) {
    return (
      <QuizPlay
        quizId={quizId}
        onBack={() => setQuizId(undefined)}
        onHistory={() => setQuizId(undefined)}
      />
    );
  }

  return <QuizList onSelect={setQuizId} />;
}
