import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

const users = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    last: 'Hello bro',
    time: '2m',
  },
  {
    id: 2,
    name: 'Trần Văn B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    last: 'Ok nhé',
    time: '1h',
  },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 360,
        bgcolor: 'white',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" fontWeight="bold" p={2}>
        Chats
      </Typography>

      <Box px={2} pb={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search Messenger"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List sx={{ overflow: 'auto' }}>
        {users.map((user) => (
          <ListItemButton key={user.id}>
            <ListItemAvatar>
              <Avatar src={user.avatar} />
            </ListItemAvatar>

            <ListItemText primary={user.name} secondary={user.last} />

            <Typography variant="caption" color="text.secondary">
              {user.time}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
