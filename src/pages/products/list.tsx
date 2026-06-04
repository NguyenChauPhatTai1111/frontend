import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from '@refinedev/mui';

export const ProductList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'products',
  });

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
    <List>
      <div style={{ marginBottom: 16 }}>
        <h1>Products</h1>
      </div>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
