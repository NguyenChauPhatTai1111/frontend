import { useEffect, useState } from 'react';

import { Box, Grid } from '@mui/material';

import { getQuizzes } from '@/hooks/quiz.service';
import QuizCard from './components/QuizCard';
import QuizListHeader from './components/QuizListHeader';
import type { QuizListItem } from './types';

interface Props {
  onSelect: (id: number) => void;
}

export default function QuizList({ onSelect }: Props) {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  return (
    <Box p={3}>
      <QuizListHeader />

      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} onSelect={onSelect} />
        ))}
      </Grid>
    </Box>
  );
}
