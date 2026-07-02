import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

import { useForm } from '@refinedev/react-hook-form';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

export const UserEditModal = ({ open, onClose, userId }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { saveButtonProps, register } = useForm({
    refineCoreProps: {
      resource: 'users',
      action: 'edit',
      id: userId ?? undefined,

      onMutationSuccess: () => {
        setConfirmOpen(false);
        onClose();
      },

      successNotification: () => ({
        message: 'Cập nhật người dùng thành công',
        description: 'Thông tin người dùng đã được lưu',
        type: 'success',
      }),
    },
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              {...register('name')}
              fullWidth
            />

            <TextField
              label="Email"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              {...register('email')}
              fullWidth
            />

            <TextField
              label="role"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              {...register('role')}
              fullWidth
            />

            <TextField
              label="Password mới"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              {...register('password')}
              fullWidth
              helperText="Để trống nếu không muốn thay đổi mật khẩu"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            variant="contained"
            onClick={() => setConfirmOpen(true)}
            disabled={saveButtonProps.disabled}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận cập nhật</DialogTitle>

        <DialogContent>Bạn có chắc muốn cập nhật người dùng này?</DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>

          <Button
            variant="contained"
            onClick={(e) => {
              saveButtonProps.onClick?.(e);
              setConfirmOpen(false);
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
