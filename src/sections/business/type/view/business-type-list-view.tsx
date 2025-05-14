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
import { useState, useEffect } from 'react';
import { IBusinessType } from 'src/types/business';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  fetchBusinessTypes,
  createBusinessType,
  updateBusinessType,
  deleteBusinessType,
} from '@/redux/slices/businessSlice';
import { useSnackbar } from 'notistack';
import BusinessTypeDialog from '../business-type-dialog';
import BusinessTypeTableRow from '../business-type-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Type Name' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

export default function BusinessTypeListView() {
  const dispatch = useAppDispatch();
  const { businessTypes, loading } = useAppSelector((state) => state.business);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBusinessType, setCurrentBusinessType] = useState<IBusinessType | null>(null);

  useEffect(() => {
    dispatch(fetchBusinessTypes());
  }, [dispatch]);

  const handleCreateBusinessType = async (data: any) => {
    try {
      await dispatch(createBusinessType(data)).unwrap();
      setOpenDialog(false);
      enqueueSnackbar('Business type created successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to create business type', { variant: 'error' });
    }
  };

  const handleEditBusinessType = async (id: string, data: any) => {
    try {
      await dispatch(updateBusinessType({ id: Number(id), data })).unwrap();
      setOpenDialog(false);
      setCurrentBusinessType(null);
      enqueueSnackbar('Business type updated successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to update business type', { variant: 'error' });
    }
  };

  const handleDeleteBusinessType = async (id: string) => {
    try {
      await dispatch(deleteBusinessType(id)).unwrap();
      enqueueSnackbar('Business type deleted successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete business type', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Business Types"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business', href: paths.dashboard.business.root },
          { name: 'Types' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Button
        variant="contained"
        startIcon={<Iconify icon="eva:plus-fill" />}
        sx={{ mb: 3 }}
        onClick={() => setOpenDialog(true)}
      >
        New Business Type
      </Button>

      <BusinessTypeDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setCurrentBusinessType(null);
        }}
        onSubmit={
          currentBusinessType
            ? (id: string, data: any) => handleEditBusinessType(id, data)
            : handleCreateBusinessType
        }
        currentBusinessType={currentBusinessType}
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
                rowCount={businessTypes.length}
                numSelected={selected.length}
                onSort={(id) => {
                  setOrder(order === 'asc' ? 'desc' : 'asc');
                  setOrderBy(id);
                }}
                onSelectAllRows={(checked) => {
                  if (checked) {
                    setSelected(businessTypes.map((row) => row.id));
                  } else {
                    setSelected([]);
                  }
                }}
              />

              <TableBody>
                {businessTypes.map((row) => (
                  <BusinessTypeTableRow
                    key={row.id}
                    row={row}
                    selected={false}
                    onSelectRow={() => {}}
                    onDeleteRow={() => handleDeleteBusinessType(row.id)}
                    onEditRow={() => {
                      setCurrentBusinessType(row);
                      setOpenDialog(true);
                    }}
                  />
                ))}

                <TableNoData notFound={!businessTypes.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={businessTypes.length}
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
