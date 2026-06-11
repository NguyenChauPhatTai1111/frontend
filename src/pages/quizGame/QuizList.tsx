import { Card, CardContent, Grid, Typography } from '@mui/material';

import { useEffect, useState } from 'react';

import { getQuizzes } from '@/hooks/quiz.service';

interface Props {
  onSelect: (id: number) => void;
}

export default function QuizList({ onSelect }: Props) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  return (
    <Grid container spacing={2}>
      {quizzes.map((quiz: any) => (
        <Grid size={4} key={quiz.id}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => onSelect(quiz.id)}>
            <CardContent>
              <Typography variant="h6">{quiz.title}</Typography>

              <Typography>{quiz.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
