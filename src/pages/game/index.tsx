import { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const chars = [
  ...'abcdefghijklmnopqrstuvwxyz',
  ...'0123456789',
  '@',
  '.',
  '_',
  '-',
];

export const GamePage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const correctEmail = user.email;

  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const addChar = (char: string) => {
    setValue((prev) => prev + char);
  };

  const submit = () => {
    if (value === correctEmail) {
      localStorage.setItem('gamePassed', 'true');
      navigate('/users');
      return;
    }

    setError('Email không đúng');
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Trò chơi xác thực
      </Typography>

      <Typography gutterBottom>Hãy nhập đúng email của bạn</Typography>

      <TextField fullWidth value={value} sx={{ mb: 2 }} />

      <Stack direction="row" flexWrap="wrap" gap={1}>
        {chars.map((char) => (
          <Button key={char} variant="outlined" onClick={() => addChar(char)}>
            {char}
          </Button>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} mt={3}>
        <Button variant="contained" onClick={submit}>
          Kiểm tra
        </Button>

        <Button variant="outlined" onClick={() => setValue('')}>
          Xóa
        </Button>
      </Stack>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </div>
  );
};
