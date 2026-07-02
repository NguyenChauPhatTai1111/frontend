import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuizIcon from '@mui/icons-material/Quiz';

import type { QuizListItem } from '../types';

interface QuizCardProps {
  quiz: QuizListItem;
  onSelect: (id: number) => void;
}

export default function QuizCard({ quiz, onSelect }: QuizCardProps) {
  return (
    <Grid item xs={12} sm={6} md={3}>
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

          <Typography variant="body2" color="primary" fontWeight={600} mb={1}>
            📝 {quiz.questions_count ?? 0}
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
  );
}
