import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        🎉 Hoàn thành bài quiz
      </Typography>

      <Typography variant="h2" color="primary.main" fontWeight={700} mb={1}>
        {score}/10
      </Typography>

      <Typography variant="h5" color="success.main" fontWeight={600} mb={3}>
        📊 {percentage}%
      </Typography>

      <Typography variant="h6">✅ Đúng: {correctCount} câu</Typography>

      <Typography variant="h6" color="error.main">
        ❌ Sai: {wrongCount} câu
      </Typography>

      <Typography mt={2}>Tổng số câu: {totalQuestions}</Typography>

      <Box
        mt={3}
        display="flex"
        gap={2}
        justifyContent="center"
        flexWrap="wrap"
      >
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
    </Box>
  );
}
