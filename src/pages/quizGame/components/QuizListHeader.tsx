import { Typography } from '@mui/material';

export default function QuizListHeader() {
  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={1}>
        🚀 Programming Quizzes
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Chọn một chủ đề và bắt đầu thử thách kiến thức của bạn
      </Typography>
    </>
  );
}
