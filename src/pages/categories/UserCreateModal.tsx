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
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from './ValidateUserCreate';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UserCreateModal = ({ open, onClose }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    refineCoreProps: {
      resource: 'users',
      action: 'create',

      onMutationSuccess: () => {
        setConfirmOpen(false);
        reset();
        onClose();
      },

      successNotification: () => ({
        message: 'Tạo user thành công',
        type: 'success',
      }),
    },
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Create User</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              autoComplete="off"
              {...register('name')}
              helperText={errors.name?.message}
              error={!!errors.name}
            />

            <TextField
              label="Email"
              fullWidth
              autoComplete="off"
              {...register('email')}
              helperText={errors.email?.message}
              error={!!errors.email}
            />

            <TextField
              label="Role"
              fullWidth
              autoComplete="new-password" // hoặc "off"
              {...register('role')}
              helperText={errors.role?.message}
              error={!!errors.role}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              autoComplete="new-password"
              {...register('password')}
              helperText={errors.password?.message}
              error={!!errors.password}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button
            variant="contained"
            onClick={() => setConfirmOpen(true)}
            disabled={formLoading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận</DialogTitle>

        <DialogContent>Bạn có chắc muốn tạo user này?</DialogContent>

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
