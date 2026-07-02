import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuizCelebration from './components/QuizCelebration';

interface Props {
  score: number;
  percentage: number;

  correctCount: number;
  wrongCount: number;
  totalQuestions: number;

  onRetry: () => void;
  onReview: () => void;
  onBack: () => void;
}

export default function QuizResult({
  score,
  percentage,

  correctCount,
  wrongCount,
  totalQuestions,

  onRetry,
  onReview,
  onBack,
}: Props) {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)',
        }}
      >
        <QuizCelebration percentage={percentage} />

        <Typography
          variant="h4"
          gutterBottom
          fontWeight={700}
          color="primary.dark"
        >
          🎉 Hoàn thành bài quiz
        </Typography>

        <Typography variant="h2" color="primary.main" fontWeight={800} mb={1}>
          {score}/10
        </Typography>

        <Typography variant="h5" color="success.main" fontWeight={700} mb={3}>
          📊 {percentage}%
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          mb={3}
        >
          <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'success.dark' }}>
            <Typography variant="h6">✅ Đúng: {correctCount} câu</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'error.dark' }}>
            <Typography variant="h6" color="error.dark">
              ❌ Sai: {wrongCount} câu
            </Typography>
          </Box>
        </Stack>

        <Typography mb={3}>Tổng số câu: {totalQuestions}</Typography>

        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button variant="contained" size="large" onClick={onRetry}>
            🔄 Làm lại
          </Button>

          <Button variant="outlined" onClick={onReview}>
            📖 Xem lại bài
          </Button>

          <Button variant="outlined" onClick={onBack}>
            ← Về danh sách bài thi
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/quiz-game/history')}
          >
            Xem lịch sử làm bài
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
