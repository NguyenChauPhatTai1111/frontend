import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export const ProductDetail = () => {
  const { query } = useShow();

  const product = query.data?.data;

  return (
    <Show isLoading={query.isLoading} title={false} headerButtons={() => null}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 42 }} />
          </Avatar>

          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {product?.name}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip size="small" color="primary" label={`#${product?.id}`} />

              <Chip size="small" color="success" label="Active" />
            </Stack>
          </Box>

          <Typography variant="h4" color="primary" fontWeight={700}>
            {product?.price?.toLocaleString()} ₫
          </Typography>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* Content */}
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              PRODUCT INFORMATION
            </Typography>

            <Stack spacing={2} mt={1}>
              <InfoRow label="Product ID" value={product?.id} />
              <InfoRow label="Product Name" value={product?.name} />
              <InfoRow
                label="Price"
                value={`${product?.price?.toLocaleString()} ₫`}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              DESCRIPTION
            </Typography>

            <Typography
              mt={1}
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
              }}
            >
              {product?.description || 'No description'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Image
            </Typography>

            <Typography
              mt={1}
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
              }}
            >
              {product?.image || 'No image available'}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Show>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    sx={{
      py: 1.5,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography color="text.secondary">{label}</Typography>

    <Typography fontWeight={600}>{value ?? '-'}</Typography>
  </Stack>
);
