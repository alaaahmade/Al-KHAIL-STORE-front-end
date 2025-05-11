'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// components
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { TableNoData, TableHeadCustom } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
// types
import { IUserItem } from 'src/types/user';
// hooks
// routes
import { paths } from 'src/routes/paths';
// sections
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { fetchUsers, deleteUser, updateUser, createUser } from 'src/redux/slices/userSlice';
import { fetchRoles } from 'src/redux/slices/roleSlice';
import { UserTableRow, UserTableToolbar } from '../user-table';
import UserDialog from '../user-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'actions', label: 'Actions' },
];

export default function UserListView() {
  // const settings = useSettingsContext();
  const dispatch = useAppDispatch();
  const { users = [], loading } = useAppSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUserItem | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleDeleteUser = useCallback(
    async (userId: number) => {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        enqueueSnackbar('User deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Failed to delete user', { variant: 'error' });
      }
    },
    [dispatch, enqueueSnackbar]
  );

  const handleOpenEdit = (user: IUserItem) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleCreateUser = async (data: any) => {
    try {
      await dispatch(createUser(data)).unwrap();
      setOpenDialog(false);
      enqueueSnackbar('User created successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to create user', { variant: 'error' });
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      await dispatch(updateUser({ id: currentUser!.id, data })).unwrap();
      setOpenDialog(false);
      setCurrentUser(null);
      enqueueSnackbar('User updated successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update user', { variant: 'error' });
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user: IUserItem) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterName.toLowerCase()) ||
          user.email.toLowerCase().includes(filterName.toLowerCase())
      )
    : [];

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading="Users List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User Management', href: paths.dashboard.user.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(e) => setFilterName(e.target.value)}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={filteredUsers.length}
                numSelected={selected.length}
                onSort={(id) => {
                  setOrderBy(id);
                  setOrder(order === 'asc' ? 'desc' : 'asc');
                }}
                onSelectAllRows={(checked) =>
                  setSelected(
                    checked ? filteredUsers.map((row: IUserItem) => row.id.toString()) : []
                  )
                }
              />

              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: IUserItem) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id.toString())}
                      onSelectRow={() => {
                        const selectedIndex = selected.indexOf(row.id.toString());
                        let newSelected: string[] = [];
                        if (selectedIndex === -1) {
                          newSelected = newSelected.concat(selected, row.id.toString());
                        } else if (selectedIndex === 0) {
                          newSelected = newSelected.concat(selected.slice(1));
                        } else if (selectedIndex === selected.length - 1) {
                          newSelected = newSelected.concat(selected.slice(0, -1));
                        } else if (selectedIndex > 0) {
                          newSelected = newSelected.concat(
                            selected.slice(0, selectedIndex),
                            selected.slice(selectedIndex + 1)
                          );
                        }
                        setSelected(newSelected);
                      }}
                      onDeleteRow={() => handleDeleteUser(row.id)}
                      onEditRow={() => handleOpenEdit(row)}
                    />
                  ))}

                <TableNoData notFound={!filteredUsers.length && !!filterName} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setPage(0);
            setRowsPerPage(Number(e.target.value));
          }}
        />
      </Card>

      <UserDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setCurrentUser(null);
        }}
        onSubmit={currentUser ? handleEditUser : handleCreateUser}
        currentUser={currentUser}
      />
    </Container>
  );
}
