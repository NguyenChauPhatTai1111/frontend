import { Box, Typography, Button } from '@mui/material';

interface Props {
  quiz: any;
  selected: Record<number, number>;
  unansweredQuestions: any[];
  onBack: () => void;
}

export default function QuizReview({
  quiz,
  selected,
  unansweredQuestions,
  onBack,
}: Props) {
  return (
    <Box>
      <Typography variant="h4" mb={3}>
        📖 Xem lại bài làm
      </Typography>

      {quiz.questions.map((question: any, index: number) => {
        const selectedAnswer = selected[question.id];

        const correctAnswer = question.answers.find((a: any) => a.is_correct);

        const isCorrect = question.answers.some(
          (a: any) => a.id === selectedAnswer && a.is_correct,
        );

        const isUnanswered = unansweredQuestions.some(
          (q: any) => q.id === question.id,
        );

        return (
          <Box
            key={question.id}
            sx={{
              mb: 4,
              p: 2,
              border: '1px solid #ddd',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" mb={2}>
              Câu {index + 1}: {question.question}
            </Typography>

            {question.answers.map((answer: any) => {
              const isSelected = answer.id === selectedAnswer;

              const isRight = answer.id === correctAnswer?.id;

              return (
                <Box
                  key={answer.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: isRight
                      ? '#00e213'
                      : isSelected && !isRight
                        ? '#ff2626'
                        : '#000000',
                  }}
                >
                  <Typography>
                    {isRight && '✅ '}
                    {isSelected && !isRight && '❌ '}
                    {answer.answer_text}
                  </Typography>
                </Box>
              );
            })}

            <Typography
              mt={2}
              fontWeight={700}
              color={
                isUnanswered
                  ? 'warning.main'
                  : isCorrect
                    ? 'success.main'
                    : 'error.main'
              }
            >
              {isUnanswered
                ? 'Chưa chọn đáp án'
                : isCorrect
                  ? 'Bạn trả lời đúng'
                  : 'Bạn trả lời sai'}
            </Typography>
          </Box>
        );
      })}

      <Button variant="contained" onClick={onBack}>
        ← Quay lại kết quả
      </Button>
    </Box>
  );
}
