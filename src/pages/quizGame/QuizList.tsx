import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuizIcon from '@mui/icons-material/Quiz';

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
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        🚀 Programming Quizzes
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Chọn một chủ đề và bắt đầu thử thách kiến thức của bạn
      </Typography>

      <Grid container spacing={3}>
        {quizzes.map((quiz: any) => (
          <Grid
            key={quiz.id}
            size={{
              xs: 12,
              sm: 6,
              md: 3, // 4 cột trên desktop
            }}
          >
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                transition: '0.25s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={
                  quiz.image ||
                  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'
                }
                alt={quiz.title}
                sx={{
                  height: 140,
                  objectFit: 'cover',
                }}
              />

              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Chip
                  icon={<QuizIcon />}
                  label="Quiz"
                  color="primary"
                  size="small"
                  sx={{ width: 'fit-content', mb: 2 }}
                />

                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    minHeight: 56,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {quiz.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="primary"
                  fontWeight={600}
                  mb={1}
                >
                  📝 {quiz.questions_count}
                  câu
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    flex: 1,
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {quiz.description}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<PlayArrowIcon />}
                  onClick={() => onSelect(quiz.id)}
                >
                  Bắt đầu làm bài
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
