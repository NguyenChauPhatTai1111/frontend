import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
} from '@mui/material';

import { useEffect, useState } from 'react';

import { getQuizHistory } from '@/hooks/quiz.service';

export default function QuizHistory() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getQuizHistory().then(setHistory);
  }, []);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Lịch sử làm bài</Typography>

        <Button variant="outlined">Quay lại</Button>
      </Box>

      <Grid container spacing={3}>
        {history.map((attempt) => (
          <Grid size={{ xs: 12, md: 6 }} key={attempt.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {attempt.quiz?.title}
                </Typography>

                <Box mb={2}>
                  <Chip label={`${attempt.percentage}%`} />
                </Box>

                <Typography>Điểm: {attempt.score}</Typography>

                <Typography>Đúng: {attempt.correct_answers}</Typography>

                <Typography>Sai: {attempt.wrong_answers}</Typography>

                <Typography>Tổng câu: {attempt.total_questions}</Typography>

                <Typography color="text.secondary" mt={2}>
                  {new Date(attempt.created_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {history.length === 0 && (
        <Typography textAlign="center">Chưa có lịch sử làm bài</Typography>
      )}
    </Box>
  );
}
