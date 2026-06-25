import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getQuizDetail,
  submitQuiz,
  getQuizMarks,
  toggleQuizMark,
} from '@/hooks/quiz.service';
import ModalFinishTest from './modalFinishText';
import QuizReview from './QuizReview';
import QuizResult from './finished';
import { Snackbar, Alert } from '@mui/material';
import QuizAiHelper from './QuizAI';
import useVoiceAnswer from '@/hooks/useVoiceAnswer';
interface Props {
  quizId: number;
  onBack: () => void;
  onHistory: () => void;
}

export default function QuizPlay({ quizId, onBack }: Props) {
  const [quiz, setQuiz] = useState<any>(null);
  const TOTAL_TIME = 10 * 60; // 10 phút
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);
  const isLocked = timeLeft <= 0;
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [aiUsed, setAiUsed] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [noti, setNoti] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'info' | 'warning' | 'error',
  });
  useEffect(() => {
    if (!quizId) return;

    const loadData = async () => {
      const quizData = await getQuizDetail(quizId);
      setQuiz(quizData);

      const marks = await getQuizMarks(quizId);

      const map: Record<number, boolean> = {};
      marks.forEach((id: number) => {
        map[id] = true;
      });

      setMarked(map);
    };

    loadData();
  }, [quizId]);
  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  // const nexif (!quiz || !currentQuestion) return null;tQuestion = () => {
  //   if (!quiz) return;

  //   if (currentQuestionIndex < quiz.questions.length - 1) {
  //     setCurrentQuestionIndex((prev) => prev + 1);
  //     setTimeLeft(15);
  //     setIsTimeUp(false);
  //   } else {
  //     setFinished(true);
  //   }
  // };

  const handleAnswer = (answerId: number) => {
    if (finished || !currentQuestion) return;

    setSelected((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));
  };
  useVoiceAnswer(voiceEnabled ? currentQuestion : null, handleAnswer);
  const handleRetry = () => {
    setFinished(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(TOTAL_TIME);
    setIsTimeUp(false);
    setSelected({});
  };

  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      setOpenSubmitDialog(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!quiz) return null;

  const unansweredQuestions = quiz.questions.filter(
    (q: any) => !selected[q.id],
  );

  const canSubmit = unansweredQuestions.length === 0;
  const correctCount = quiz.questions.filter((question: any) => {
    const selectedAnswer = selected[question.id];

    return question.answers.some(
      (answer: any) => answer.id === selectedAnswer && answer.is_correct,
    );
  }).length;

  const wrongCount = quiz.questions.length - correctCount;
  const pointPerQuestion = 10 / quiz.questions.length;

  const score = Math.round(correctCount * pointPerQuestion * 100) / 100;

  const handlePrevQuestion = () => {
    if (currentQuestionIndex === 0) return;

    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= quiz.questions.length - 1) return;

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleSubmitQuiz = async () => {
    console.log('HANDLE SUBMIT');

    try {
      const answers = Object.entries(selected).map(
        ([questionId, answerId]) => ({
          question_id: Number(questionId),
          answer_id: answerId,
        }),
      );

      console.log('ANSWERS', answers);

      const data = await submitQuiz(quiz.id, answers);

      console.log('RESULT', data);

      setResult(data);
      setOpenSubmitDialog(false);
      setFinished(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleMark = async (questionId: number) => {
    const res = await toggleQuizMark(quizId, questionId);

    setMarked((prev) => ({
      ...prev,
      [questionId]: res.marked,
    }));
    setNoti({
      open: true,
      message: res.message,
      severity: res.marked ? 'success' : 'info',
    });
  };

  if (reviewMode) {
    return (
      <QuizReview
        quiz={quiz}
        selected={selected}
        unansweredQuestions={unansweredQuestions}
        onBack={() => setReviewMode(false)}
      />
    );
  }

  if (finished) {
    return (
      <QuizResult
        score={result?.score ?? score}
        correctCount={result?.correct_answers ?? correctCount}
        wrongCount={result?.wrong_answers ?? wrongCount}
        totalQuestions={quiz.questions.length}
        percentage={result?.percentage ?? 0}
        onRetry={handleRetry}
        onReview={() => setReviewMode(true)}
        onBack={onBack}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          p: 3,
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Button variant="outlined" onClick={onBack}>
            ← Danh sách Quiz
          </Button>

          <Typography variant="h5" fontWeight={700}>
            {quiz.title}
          </Typography>
        </Stack>

        {/* Progress */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>
              Câu {currentQuestionIndex + 1}/{quiz.questions.length}
            </Typography>

            <Typography
              fontWeight={700}
              sx={{
                color: timeLeft <= 30 ? 'error.main' : 'primary.main',

                animation:
                  timeLeft > 0 && timeLeft <= 10
                    ? 'countdownPulse 1s ease-in-out infinite'
                    : 'none',

                '@keyframes countdownPulse': {
                  '0%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              ⏰ {formatTime(timeLeft)}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
            sx={{
              height: 10,
              borderRadius: 999,
            }}
          />
        </Paper>

        {/* Question Card */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={3}>
            <Box sx={{ display: 'flex', gap: 5 }}>
              {currentQuestion.question}
              <Button
                size="small"
                variant={
                  marked?.[currentQuestion.id] ? 'contained' : 'outlined'
                }
                color={marked?.[currentQuestion.id] ? 'error' : 'inherit'}
                disabled
              >
                🤖 AI:{' '}
                {marked?.[currentQuestion.id] ? 'Hard question' : 'Normal'}
              </Button>
            </Box>
          </Typography>
          <Button
            variant={voiceEnabled ? 'contained' : 'outlined'}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            🎤 Voice Mode
          </Button>
          <QuizAiHelper
            quizId={quizId}
            currentQuestion={currentQuestion}
            aiUsed={aiUsed}
            setAiUsed={setAiUsed}
            setSelected={setSelected}
          />
          <RadioGroup
            value={selected[currentQuestion.id] ?? ''}
            onChange={(e) => handleAnswer(Number(e.target.value))}
          >
            {currentQuestion.answers?.length > 0 ? (
              currentQuestion.answers.map((answer: any, index: number) => (
                <Paper
                  key={answer.id}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    borderWidth: 2,
                    borderColor:
                      selected[currentQuestion.id] === answer.id
                        ? 'success.main'
                        : 'divider',
                    transition: '0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <FormControlLabel
                    value={answer.id}
                    disabled={isTimeUp || isLocked}
                    control={<Radio />}
                    label={`${String.fromCharCode(
                      65 + index,
                    )}. ${answer.answer_text}`}
                    sx={{
                      width: '100%',
                      px: 2,
                      py: 1,
                      m: 0,
                    }}
                  />
                </Paper>
              ))
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'grey.150',
                }}
              >
                <Typography color="text.secondary">
                  🚧 Câu hỏi này đang được phát triển, vui lòng quay lại sau.
                </Typography>
              </Paper>
            )}
          </RadioGroup>
        </Paper>

        {/* Footer */}
        <Stack direction="row" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            size="large"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0 || isLocked}
          >
            ← Câu trước
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => setOpenSubmitDialog(true)}
            >
              🚀 Nộp bài
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleNextQuestion}
              disabled={isLocked}
            >
              Câu tiếp →
            </Button>
          )}
        </Stack>
      </Box>
      <Snackbar
        open={noti.open}
        autoHideDuration={3000}
        onClose={() => setNoti((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNoti((p) => ({ ...p, open: false }))}
          severity={noti.severity}
          variant="filled"
        >
          {noti.message}
        </Alert>
      </Snackbar>

      <ModalFinishTest
        open={openSubmitDialog}
        canSubmit={canSubmit}
        unansweredQuestions={unansweredQuestions}
        questions={quiz.questions}
        onClose={() => setOpenSubmitDialog(false)}
        onSubmit={handleSubmitQuiz}
      />
    </>
  );
}
