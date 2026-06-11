import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';

import { getQuizDetail } from '@/hooks/quiz.service';

interface Props {
  quizId: number;
}

export default function QuizPlay({ quizId }: Props) {
  const [quiz, setQuiz] = useState<any>();
  const [timeLeft, setTimeLeft] = useState(15);

  const [isTimeUp, setIsTimeUp] = useState(false);
  const [selected, setSelected] = useState<Record<number, number>>({});

  useEffect(() => {
    getQuizDetail(quizId).then(setQuiz);
  }, [quizId]);

  useEffect(() => {
    if (!quiz) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quiz]);
  if (!quiz) return null;

  return (
    <Box>
      <Typography variant="h4">{quiz.title}</Typography>

      <Typography
        variant="h5"
        color={timeLeft <= 5 ? 'error.main' : 'primary.main'}
      >
        ⏰ {timeLeft}s
      </Typography>
      {isTimeUp && (
        <Typography color="error.main" fontWeight={700}>
          ⛔ Hết giờ!
        </Typography>
      )}

      {quiz.questions.map((question: any, index: number) => (
        <Box key={question.id} mb={4}>
          <Typography>
            {index + 1}. {question.question}
          </Typography>

          <RadioGroup
            value={selected[question.id] ?? ''}
            onChange={(e) =>
              setSelected((prev) => ({
                ...prev,
                [question.id]: Number(e.target.value),
              }))
            }
          >
            {question.answers.map((answer: any) => (
              <FormControlLabel
                key={answer.id}
                value={answer.id}
                disabled={isTimeUp}
                control={<Radio />}
                label={answer.answer_text}
              />
            ))}
            {isTimeUp && (
              <Typography color="success.main" mt={1}>
                ✅ Đáp án đúng:{' '}
                {question.answers.find((a: any) => a.is_correct)?.answer_text}
              </Typography>
            )}
          </RadioGroup>
          {selected[question.id] && (
            <>
              {question.answers.find((a: any) => a.id === selected[question.id])
                ?.is_correct ? (
                <Typography color="success.main" fontWeight={700}>
                  ✅ Chính xác!
                </Typography>
              ) : (
                <Typography color="error.main" fontWeight={700}>
                  ❌ Sai rồi!
                </Typography>
              )}
            </>
          )}
        </Box>
      ))}

      <Button variant="contained" onClick={() => console.log(selected)}>
        Submit
      </Button>
    </Box>
  );
}
