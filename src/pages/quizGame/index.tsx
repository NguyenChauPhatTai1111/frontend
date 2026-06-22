import { useState } from 'react';

import QuizList from './QuizList';
import QuizPlay from './QuizPlay';
import QuizHistory from './QuizHistory';

export default function QuizGamePage() {
  const [quizId, setQuizId] = useState<number>();
  const [showHistory, setShowHistory] = useState(false);

  if (showHistory) {
    return <QuizHistory onBack={() => setShowHistory(false)} />;
  }

  if (quizId) {
    return (
      <QuizPlay
        quizId={quizId}
        onBack={() => setQuizId(undefined)}
        onHistory={() => setShowHistory(true)}
      />
    );
  }

  return <QuizList onSelect={setQuizId} />;
}
