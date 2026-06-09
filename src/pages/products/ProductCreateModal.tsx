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
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { productSchema } from './ValidateProductCreate';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ProductCreateModal = ({ open, onClose }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [image, setImage] = useState<File | null>(null);

  const {
    saveButtonProps,
    register,
    reset,
    control,
    setValue,
    getValues,
    refineCore: { formLoading },
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),

    refineCoreProps: {
      resource: 'products',
      action: 'create',

      onMutationSuccess: () => {
        reset();
        setImage(null);
        setConfirmOpen(false);
        onClose();
      },

      successNotification: () => ({
        message: 'Tạo sản phẩm thành công',
        type: 'success',
      }),
    },
  });
  const name = useWatch({
    control,
    name: 'name',
  });

  useEffect(() => {
    if (!name) {
      setValue('slug', '');
      return;
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt
      .trim()
      .replace(/\s+/g, '-'); // space -> -

    setValue('slug', slug);
  }, [name, setValue]);
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Product</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Product Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Product Slug"
              {...register('slug')}
              error={!!errors.slug}
              autoComplete="off"
              helperText={errors.slug?.message}
            />

            <TextField
              label="Price"
              type="number"
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <TextField
              label="Quantity"
              type="number"
              {...register('quantity')}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />

            <Button variant="outlined" component="label">
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;

                  setImage(file);
                }}
              />
            </Button>

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                style={{
                  width: 150,
                  borderRadius: 12,
                }}
              />
            )}
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận tạo sản phẩm</DialogTitle>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>

          <Button
            variant="contained"
            onClick={(e) => {
              saveButtonProps.onClick?.(e);
              console.log('IMAGE =', image);
              console.log('FORM =', getValues());
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
