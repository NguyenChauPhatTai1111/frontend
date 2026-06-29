import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

export default function Messenger() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f0f2f5',
      }}
    >
      <Sidebar />
      <ChatWindow />
    </Box>
  );
}
