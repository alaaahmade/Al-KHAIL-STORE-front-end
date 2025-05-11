'use client';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { Container, Button } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableNoData, TableHeadCustom } from 'src/components/table';
import { UserTableToolbar } from 'src/sections/user/user-table';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  fetchBusinesses,
  createBusiness,
  fetchBusinessTypes,
  updateBusiness,
  deleteBusiness,
} from 'src/redux/slices/businessSlice';
import { IBusiness } from 'src/types/business';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { fetchUsers } from 'src/redux/slices/userSlice';
import BusinessTableRow from '../business-table-row';
import BusinessDialog from '../business-dialog';

const TABLE_HEAD = [
  { id: 'name', label: 'Business Name' },
  { id: 'address', label: 'Address' },
  { id: 'contactEmail', label: 'Email' },
  { id: 'contactNumber', label: 'Phone' },
  { id: 'type', label: 'Type' },
  { id: 'owner', label: 'Owner' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

export default function BusinessListView() {
  const dispatch = useAppDispatch();
  const { businesses } = useAppSelector((state) => state.business);
  const { users } = useAppSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<IBusiness | null>(null);

  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleCreateBusiness = async (data: any) => {
    try {
      await dispatch(createBusiness(data)).unwrap();
      setOpenDialog(false);
      enqueueSnackbar('Business created successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to create business', { variant: 'error' });
    }
  };

  const handleEditBusiness = async (id: string, data: any) => {
    try {
      await dispatch(updateBusiness({ id, data })).unwrap();
      setOpenDialog(false);
      setCurrentBusiness(null);
      enqueueSnackbar('Business updated successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to update business', { variant: 'error' });
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    try {
      await dispatch(deleteBusiness(id)).unwrap();
      enqueueSnackbar('Business deleted successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete business', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Business List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business', href: paths.dashboard.business.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Button
        component="a"
        onClick={() => setOpenDialog(true)}
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        sx={{ mb: 3 }}
      >
        New Business
      </Button>

      <BusinessDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setCurrentBusiness(null);
        }}
        onSubmit={currentBusiness ? handleEditBusiness : handleCreateBusiness}
        users={users}
        currentBusiness={currentBusiness}
      />

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <UserTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={(event) => setFilterName(event.target.value)}
          />

          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={businesses.length}
                numSelected={selected.length}
                onSort={(id) => {
                  setOrder(order === 'asc' ? 'desc' : 'asc');
                  setOrderBy(id);
                }}
                onSelectAllRows={(checked) => {
                  if (checked) {
                    setSelected(businesses.map((business) => business.id));
                  } else {
                    setSelected([]);
                  }
                }}
              />

              <TableBody>
                {businesses.map((row) => (
                  <BusinessTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => {}}
                    onDeleteRow={() => handleDeleteBusiness(row.id)}
                    onEditRow={() => {
                      setCurrentBusiness(row);
                      setOpenDialog(true);
                    }}
                  />
                ))}
                <TableNoData notFound={!businesses.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={businesses.length}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setPage(0);
            setRowsPerPage(Number(e.target.value));
          }}
        />
      </Card>
    </Container>
  );
}
