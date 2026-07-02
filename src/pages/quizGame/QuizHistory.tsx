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

import { getQuizHistory, getQuizMarks } from '@/hooks/quiz.service';

export default function QuizHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<number, any[]>>({});
  useEffect(() => {
    const loadData = async () => {
      const attempts = await getQuizHistory();

      setHistory(attempts);

      const markData: Record<number, any[]> = {};

      await Promise.all(
        attempts.map(async (attempt: any) => {
          try {
            const marks = await getQuizMarks(attempt.quiz_id);
            markData[attempt.quiz_id] = marks;
          } catch {
            markData[attempt.quiz_id] = [];
          }
        }),
      );

      setMarks(markData);
    };

    loadData();
  }, []);

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Lịch sử làm bài</Typography>

        <Button variant="outlined">Quay lại</Button>
      </Box>
      <Grid container spacing={3}>
        {history.map((attempt) => (
          <Grid item xs={12} md={6} key={attempt.id}>
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

                {/* Câu hỏi đặc biệt */}
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Câu hỏi đặc biệt:
                  </Typography>

                  {marks[attempt.quiz_id]?.length > 0 ? (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {marks[attempt.quiz_id].map((questionId: number) => (
                        <Chip
                          key={questionId}
                          label={`Câu hỏi #${questionId}`}
                          color="warning"
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không có câu hỏi đặc biệt
                    </Typography>
                  )}
                </Box>
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
