import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion } from 'framer-motion';
import { askAIForQuestion } from '@/hooks/quiz.service';
import { Dispatch, SetStateAction } from 'react';
import { toggleQuizMark } from '@/hooks/quiz.service';
interface Props {
  currentQuestion: {
    id: number;
    question: string;
  };
  aiUsed: boolean;
  quizId: number;
  setAiUsed: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<Record<number, number>>>; // ✅ thêm
}

export default function QuizAiHelper({
  currentQuestion,
  aiUsed,
  setAiUsed,
  quizId,
  setSelected,
}: Props) {
  const [aiLoading, setAiLoading] = useState(false);

  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const handleToggleMark = async (questionId: number) => {
    const res = await toggleQuizMark(quizId, questionId);

    setMarked((prev) => ({
      ...prev,
      [questionId]: res.marked,
    }));
    setRobotMessage(
      res.marked
        ? `⭐ Đã đánh dấu câu hỏi này\n\n${res.message}`
        : `↩️ Đã bỏ đánh dấu câu hỏi\n\n${res.message}`,
    );
  };

  const [robotMode, setRobotMode] = useState<
    'idle' | 'searching' | 'returning'
  >('idle');

  const [robotMessage, setRobotMessage] = useState(
    '🤖 Nhấn vào tôi nếu bạn cần AI hỗ trợ câu hỏi này',
  );

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleAskAI = async () => {
    if (aiUsed || aiLoading) return;

    try {
      setAiLoading(true);
      setRobotMode('searching');

      setRobotMessage('📖 Đang đọc câu hỏi...');
      await delay(1200);

      setRobotMessage('🔍 Đang tìm dữ liệu...');
      await delay(1200);

      setRobotMessage('🧠 Đang suy luận đáp án...');
      await delay(1800);

      const [aiData] = await Promise.all([
        askAIForQuestion(currentQuestion.id),
        handleToggleMark(currentQuestion.id),
      ]);

      setSelected((prev) => ({
        ...prev,
        [currentQuestion.id]: aiData.answer_id,
      }));

      setRobotMessage(
        [
          '🎉 Đã tìm thấy đáp án',
          '',
          aiData.answer ? `Đáp án: ${aiData.answer}` : null,
          '',
          aiData.suggestion,
        ]
          .filter(Boolean)
          .join('\n'),
      );

      setAiUsed(true);
      setRobotMode('returning');

      setTimeout(() => setRobotMode('idle'), 1500);
    } catch (error) {
      console.error(error);
      setRobotMessage('❌ AI gặp lỗi khi phân tích.');
      setRobotMode('idle');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    setRobotMode('idle');
    if (aiUsed) {
      setRobotMessage('da su dung toi');
    } else {
      setRobotMessage('🤖 Nhấn vào tôi nếu bạn cần AI hỗ trợ câu hỏi này');
    }
  }, [currentQuestion.id]);

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 25,
        bottom: 25,
        zIndex: 9999,
      }}
    >
      <motion.div
        animate={
          robotMode === 'searching'
            ? {
                x: [0, -500, -200, -700, -300, 0],
                y: [0, -250, -100, -350, -200, 0],
              }
            : {
                x: 0,
                y: 0,
              }
        }
        transition={{
          duration: robotMode === 'searching' ? 6 : 1.5,
          ease: 'easeInOut',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Bubble */}
          <Paper
            elevation={6}
            sx={{
              position: 'absolute',
              bottom: 105,
              right: 0,
              px: 2,
              py: 1.5,
              borderRadius: 3,
              minWidth: 280,
              maxWidth: 380,
              whiteSpace: 'pre-line',
            }}
          >
            <Typography fontSize={14}>{robotMessage}</Typography>

            <Box
              sx={{
                position: 'absolute',
                bottom: -8,
                right: 40,
                width: 16,
                height: 16,
                bgcolor: '#fff',
                transform: 'rotate(45deg)',
              }}
            />
          </Paper>

          {/* Robot Button */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAskAI}
            style={{
              cursor: aiUsed || aiLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <motion.div
              animate={{
                rotate:
                  robotMode === 'searching' ? [-15, 15, -15] : [-5, 5, -5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              <SmartToyIcon
                sx={{
                  fontSize: 90,
                  color: aiUsed ? '#9e9e9e' : '#7c4dff',
                  filter: 'drop-shadow(0 0 15px rgba(124,77,255,.6))',
                }}
              />
            </motion.div>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
