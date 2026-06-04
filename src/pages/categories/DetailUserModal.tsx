import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

import { useShow } from '@refinedev/core';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

export const DetailUserModal = ({ open, onClose, userId }: Props) => {
  const { query } = useShow({
    resource: 'users',
    id: userId ?? undefined,
    queryOptions: {
      enabled: open && !!userId,
    },
  });

  const user = query.data?.data;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chi tiết người dùng</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={user?.name ?? ''}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
          />

          <TextField
            label="Email"
            value={user?.email ?? ''}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
          />

          <TextField
            label="Role"
            value={user?.role ?? ''}
            InputLabelProps={{ shrink: true }}
            fullWidth
            disabled
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
