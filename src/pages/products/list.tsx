import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from '@refinedev/mui';
import Button from '@mui/material/Button/Button';
import Box from '@mui/material/Box/Box';
import AddIcon from '@mui/icons-material/Add';
import { ProductCreateModal } from './ProductCreateModal';

export const ProductList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'products',
  });
  const [openCreate, setOpenCreate] = React.useState(false);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 100,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'price',
        headerName: 'Price',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'discount_price',
        headerName: 'Discount Price',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 150,
        sortable: false,
        renderCell: ({ row }) => (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <List>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h1>Products</h1>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            style={{ marginBottom: 16 }}
          >
            Create Product
          </Button>
        </Box>
        <DataGrid {...dataGridProps} columns={columns} />
      </List>
      <ProductCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </>
  );
};
