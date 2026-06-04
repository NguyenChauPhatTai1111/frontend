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
        bgcolor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 700,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          🎮 Trò Chơi Xác Thực
        </Typography>

        <Typography textAlign="center" color="text.secondary">
          Hãy nhập đúng email để mở Dashboard
        </Typography>

        <Typography textAlign="center" color="primary" fontWeight="bold" mt={2}>
          Gợi ý: {getMaskedEmail(correctEmail, hintLevel)}
        </Typography>

        <Typography
          textAlign="center"
          color={timeLeft <= 10 ? 'error' : 'success.main'}
          fontWeight="bold"
          mt={1}
        >
          ⏳ {timeLeft}s
        </Typography>

        <LinearProgress
          variant="determinate"
          value={
            correctEmail.length ? (value.length / correctEmail.length) * 100 : 0
          }
          sx={{
            mt: 2,
            mb: 3,
            height: 10,
            borderRadius: 10,
          }}
        />

        <TextField
          fullWidth
          value={value}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 3 }}
        />

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.5}
          justifyContent="center"
        >
          {keys.map((char, index) => (
            <Button
              key={`${char}-${index}`}
              variant="outlined"
              onClick={() => addChar(char)}
              sx={{
                minWidth: 34,
                width: 34,
                height: 34,
                p: 0,
                fontSize: 12,
                fontWeight: 'bold',
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
          mt={3}
          flexWrap="wrap"
        >
          <Button variant="contained" color="success" onClick={submit}>
            Kiểm tra
          </Button>

          <Button variant="outlined" color="warning" onClick={removeLastChar}>
            ⌫
          </Button>

          <Button variant="outlined" color="error" onClick={clearAll}>
            Xóa hết
          </Button>

          <Button variant="outlined" color="error" onClick={passGame}>
            bỏ qua
          </Button>
        </Stack>

        {error && (
          <Typography color="error" textAlign="center" mt={2} fontWeight="bold">
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
