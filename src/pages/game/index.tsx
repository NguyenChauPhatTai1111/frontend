import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';

const chars = [
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'0123456789',
  '@',
  '.',
  '_',
  '-',
];

const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

export const GamePage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const correctEmail = user.email || '';

  const [value, setValue] = useState('');
  const [hintLevel, setHintLevel] = useState(2);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [keys, setKeys] = useState(shuffle(chars));

  const getMaskedEmail = (email: string, visibleChars: number) => {
    if (!email) return '';

    const [name, domain] = email.split('@');

    if (!domain) return email;

    const visible = name.slice(0, visibleChars);
    const hidden = '*'.repeat(Math.max(name.length - visibleChars, 0));

    return `${visible}${hidden}@${domain}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setHintLevel((current) => {
            const next = current + 1;

            if (next >= correctEmail.split('@')[0].length) {
              return correctEmail.split('@')[0].length;
            }

            return next;
          });

          setTimeLeft(30);

          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [correctEmail]);

  const addChar = (char: string) => {
    setError('');
    setValue((prev) => prev + char);
    setKeys(shuffle(chars));
  };

  const removeLastChar = () => {
    setValue((prev) => prev.slice(0, -1));
  };

  const clearAll = () => {
    setValue('');
    setError('');
  };

  const passGame = () => {
    localStorage.setItem('gamePassed', 'true');
    navigate('/users');
  };

  const submit = () => {
    if (value === correctEmail) {
      localStorage.setItem('gamePassed', 'true');
      navigate('/users');
      return;
    }

    setError('❌ Email không chính xác');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2,
        background:
          'radial-gradient(circle at top left, rgba(59,130,246,0.28), transparent 24%), radial-gradient(circle at bottom right, rgba(168,85,247,0.22), transparent 32%), linear-gradient(180deg, #020617 0%, #111827 100%)',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 4, md: 6 },
          width: '100%',
          maxWidth: 760,
          borderRadius: 5,
          bgcolor: 'rgba(8, 15, 33, 0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 34px 90px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(16px)',
          color: 'common.white',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18), transparent 18%), radial-gradient(circle at 85% 10%, rgba(168,85,247,0.14), transparent 18%)',
            pointerEvents: 'none',
          }}
        />

        <Typography
          variant="h3"
          textAlign="center"
          gutterBottom
          sx={{
            position: 'relative',
            zIndex: 1,
            fontWeight: 800,
            letterSpacing: 0.5,
            background: 'linear-gradient(135deg, #7c3aed, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🎮 Trò Chơi Xác Thực
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{ position: 'relative', zIndex: 1, mb: 2 }}
        >
          Nhập đúng email của bạn để mở Dashboard. Màn hình được thiết kế sinh
          động hơn.
        </Typography>

        <Typography
          textAlign="center"
          color="primary.light"
          fontWeight="bold"
          mt={1}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          Gợi ý: {getMaskedEmail(correctEmail, hintLevel)}
        </Typography>

        <Typography
          textAlign="center"
          color={timeLeft <= 10 ? 'error.main' : 'success.main'}
          fontWeight="bold"
          mt={1}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          ⏳ {timeLeft}s
        </Typography>

        <LinearProgress
          variant="determinate"
          value={
            correctEmail.length ? (value.length / correctEmail.length) * 100 : 0
          }
          sx={{
            mt: 3,
            mb: 4,
            height: 12,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 8,
              backgroundImage: 'linear-gradient(90deg, #7c3aed, #38bdf8)',
            },
          }}
        />

        <TextField
          fullWidth
          value={value}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            mb: 3,
            input: {
              color: 'common.white',
              fontWeight: 600,
            },
          }}
        />

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.75}
          justifyContent="center"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          {keys.map((char, index) => (
            <Button
              key={`${char}-${index}`}
              variant="contained"
              color="secondary"
              onClick={() => addChar(char)}
              sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                p: 0,
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '0 10px 22px rgba(7, 18, 39, 0.28)',
              }}
            >
              {char}
            </Button>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          mt={4}
          flexWrap="wrap"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={submit}
            sx={{ minWidth: 120 }}
          >
            Kiểm tra
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={removeLastChar}
            sx={{ minWidth: 120 }}
          >
            ⌫
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={clearAll}
            sx={{ minWidth: 120 }}
          >
            Xóa hết
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={passGame}
            sx={{ minWidth: 120 }}
          >
            Bỏ qua
          </Button>
        </Stack>

        {error && (
          <Typography
            color="error.main"
            textAlign="center"
            mt={3}
            fontWeight="bold"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
