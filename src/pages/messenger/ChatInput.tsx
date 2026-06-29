import { Box, IconButton, TextField } from '@mui/material';

import ImageIcon from '@mui/icons-material/Image';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';

export default function ChatInput() {
  return (
    <Box display="flex" gap={1} p={2} borderTop="1px solid #ddd">
      <IconButton>
        <ImageIcon color="primary" />
      </IconButton>

      <IconButton>
        <EmojiEmotionsIcon color="primary" />
      </IconButton>

      <TextField fullWidth size="small" placeholder="Aa" />

      <IconButton color="primary">
        <SendIcon />
      </IconButton>
    </Box>
  );
}
