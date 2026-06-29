import { Box } from '@mui/material';

interface Props {
  me: boolean;
  text: string;
}

export default function MessageBubble({ me, text }: Props) {
  return (
    <Box display="flex" justifyContent={me ? 'flex-end' : 'flex-start'} mb={1}>
      <Box
        sx={{
          bgcolor: me ? '#0084ff' : '#fff',
          color: me ? '#fff' : '#000',
          px: 2,
          py: 1,
          borderRadius: 6,
          maxWidth: '60%',
          boxShadow: 1,
        }}
      >
        {text}
      </Box>
    </Box>
  );
}
