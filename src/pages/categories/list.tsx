import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { DeleteButton, List, ShowButton, useDataGrid } from '@refinedev/mui';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { UserEditModal } from './UserEditModal';
import { DetailUserModal } from './DetailUserModal';
import Box from '@mui/material/Box/Box';
import AddIcon from '@mui/icons-material/Add';
import { UserCreateModal } from './UserCreateModal';
import Button from '@mui/material/Button';

export const UserList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'users',
  });
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openShow, setOpenShow] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [openCreate, setOpenCreate] = React.useState(false);

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setOpenEdit(true);
  };
  const handleShow = (id: number) => {
    setSelectedId(id);
    setOpenShow(true);
  };
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
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 250,
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: 250,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 150,
        sortable: false,
        renderCell: ({ row }) => (
          <>
            <IconButton color="primary" onClick={() => handleEdit(row.id)}>
              <EditIcon />
            </IconButton>
            <ShowButton hideText onClick={() => handleShow(row.id)} />
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
            <h1>Users</h1>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            style={{ marginBottom: 16 }}
          >
            Create User
          </Button>
        </Box>
        <DataGrid {...dataGridProps} columns={columns} />
      </List>
      <UserEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        userId={selectedId}
      />
      <DetailUserModal
        open={openShow}
        onClose={() => setOpenShow(false)}
        userId={selectedId}
      />
      <UserCreateModal open={openCreate} onClose={() => setOpenCreate(false)} />
    </>
  );
};
