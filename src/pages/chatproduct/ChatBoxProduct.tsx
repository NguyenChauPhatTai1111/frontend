import { useState } from 'react';
import { Box, TextField, IconButton, Typography, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AppResource } from '@/resource';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export const ChatBoxProduct = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Gõ "product" để xem danh sách sản phẩm', sender: 'bot' },
  ]);

  const [input, setInput] = useState('');

  // 👉 CALL API GET PRODUCT
  // const fetchProducts = async () => {
  //   const res = await fetch('http://localhost:8000/api/products');
  //   const data: Product[] = await res.json();
  //   return data;
  // };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    const userMsg = {
      id: Date.now(),
      text: userText,
      sender: 'user' as const,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      // 🧠 CASE 1: keyword product
      if (userText.toLowerCase().trim() === 'product') {
        const res = await fetch(AppResource.Products);
        const products = await res.json();

        const productText = products
          .map((p: Product) => ` ${p.name} - ${p.price}`)
          .join('\n');

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: productText,
            sender: 'bot',
          },
        ]);

        return;
      }

      // 🧠 CASE 2: AI chat
      const res = await fetch(AppResource.Chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'bot',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Lỗi server ',
          sender: 'bot',
        },
      ]);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        bgcolor: '#0f1115',
        color: '#fff',
      }}
    >
      {/* CHAT */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* HEADER */}
        <Box sx={{ p: 2, bgcolor: '#151922', borderBottom: '1px solid #222' }}>
          <Typography fontWeight={600}>ChatBox Product AI</Typography>
        </Box>

        {/* MESSAGES */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Stack spacing={1}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent:
                    msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    whiteSpace: 'pre-wrap',
                    maxWidth: '70%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' ? '#2563eb' : '#1f2430',
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* INPUT */}
        <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: '#151922' }}>
          <TextField
            fullWidth
            size="small"
            placeholder='Nhập "product"...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            InputProps={{
              style: { color: '#fff' },
            }}
          />

          <IconButton
            onClick={handleSend}
            sx={{ bgcolor: '#2563eb', color: '#fff' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
