'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog, ProfileDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserItem, IUserTableFilterValue } from 'src/types/user';
//
import { Typography } from '@mui/material';
import { deleteCustomer, fetchCustomers, gitCustomers, setCustomer } from '@/redux/slices/ContactSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import UserTableRow from '../customer-table-row';
import UserTableToolbar from '../customer-table-toolbar';
import UserTableFiltersResult from '../customer-table-filters-result';
import { useAppDispatch } from '@/redux/hooks';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Active', label: 'Active' },
  { value: 'Banned', label: 'Banned' },
];

const TABLE_HEAD = [ 
  { id: 'name', label: 'Name', width:800 },
  { id: 'phoneNumber', label: 'Phone Number', width:500 },
  { id: 'status', label: 'Status', width:100},
  { id: '', width: 50 },
];

const defaultFilters: {
  name: string;
  status: string;
} = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function CustomersListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();
  const loading = useBoolean();
  const [profile, setProfile] = useState(null)
  const open = useBoolean();
  const customers = useSelector((state: any) => state.signDialog.customers);
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: customers,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {      
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {      
      loading.onTrue();
      const updatedCustomers = customers.filter((row: { id: string;}) => String(row.id) !== String(id));
      await deleteCustomer(id);
      dispatch(setCustomer({ customers: updatedCustomers }));
      table.onUpdatePageDeleteRow(dataInPage.length);
      loading.onFalse();
      // confirm.onTrue();
    },
    [customers, dispatch, dataInPage.length, table]
  );  


  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    async function fetchData() {
       const data = await dispatch(fetchCustomers())
       console.log(data);
       

    }
    fetchData();
    
  }, [dispatch]);  
  console.log({customers}, 'customersData');

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Customers
        </Typography>

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'Active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'Banned' && 'error') ||
                      (tab.value === 'all' && 'wGray') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && customers.length}
                    {tab.value === 'Active' &&
                      customers.filter((user: { status: string;}) => user.status === 'active').length}

                    {tab.value === 'pending' &&
                      customers.filter((user:{ status: string;}) => user.status === 'bending').length}
                    {tab.value === 'Banned' &&
                      customers.filter((user:{ status: string;}) => user.status === 'banned').length}
                    {tab.value === 'rejected' &&
                      customers.filter((user:{ status: string;}) => user.status === 'rejected').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={customers.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  customers.map((row: { id: string;}) => String(row.id))
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={customers.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      customers.map((row: { id: string;}) => String(row.id))
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: any) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(String(row.id))}
                        onSelectRow={() => table.onSelectRow(String(row.id))}
                        onDeleteRow={() => handleDeleteRow(String(row.id))}
                        onEditRow={() => handleEditRow(String(row.id))}
                        loading={loading.value}
                        onClickRow={() => {
                          setProfile(row)
                          open.onTrue()
                        }}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, customers.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <LoadingButton
            loading={loading.value}
            variant="contained"
            color="error"
            onClick={() => {
              
              table.selected.map((id: string) => {
                handleDeleteRow(id);
              });
              
              confirm.onFalse();
              window.location.reload();

            }}
          >
            Delete
          </LoadingButton>
        }
      />
      <ProfileDialog open={open.value} user={profile} onClose={() =>{
        open.onFalse()
         setProfile(null)
      }} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IUserItem[] | any;
  comparator: (a: any, b: any) => number;
  filters: {
    name: string;
    status: string;
  };
}) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index] as const);

  stabilizedThis.sort((a: number[], b: number[]) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user: IUserItem) => user?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user: IUserItem) => (user.status?.toLocaleLowerCase()) === status.toLocaleLowerCase());
    
  }

  return inputData;
}
