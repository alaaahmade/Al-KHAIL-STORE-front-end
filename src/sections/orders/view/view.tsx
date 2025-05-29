'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserItem, IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
//
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import UserTableRow from '../orders-table-row';
import UserTableToolbar from '../orders-table-toolbar';
import UserTableFiltersResult from '../orders-table-filters-result';
import { useAppDispatch } from '@/redux/hooks';
import { deleteOrders, fetchOrders } from '@/redux/slices/ordersSlice';
import { IOrder } from '@/types/order';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'received', label: 'Received' },
  { value: 'withdrawal', label: 'Withdrawal' },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Order ID', width: 100 },
  { id: 'customer', label: 'Customer', width: 200 },
  { id: 'total', label: 'Total', width: 120 },
  { id: 'products', label: 'Products', width: 180 },
  { id: 'date', label: 'Date', width: 160 },
  { id: 'status', label: 'Status', width: 180 },
  { id: 'actions', label: 'Actions', width: 100 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrdersView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();
  const dispatch = useAppDispatch();
  const orders = useSelector((state: any) => state.ordersSlice.orders);
  // ;
  console.log(orders[0]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: orders,
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
      const updatedTransactions = orders.filter((row: { id: string }) => row.id !== id);
      await dispatch(deleteOrders(id));
      dispatch(fetchOrders());
    },
    [orders, dataInPage.length, table]
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
      setFilters((prevState) => ({
        ...prevState,
        status: newValue,
      }));
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <Box
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h4" sx={{ mb: 5 }}>
              Orders Management
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                value={filters.name}
                onChange={(event) => handleFilters('name', event.target.value)}
                placeholder="Search Orders..."
                size="small"
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="status"
                  size="small"
                  sx={{ width: 100 }}
                  value={filters.status}
                  onChange={(e) => {
                    handleFilterStatus(e, e.target.value);
                  }}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  <MenuItem value={'delivered'}>delivered</MenuItem>
                  <MenuItem value={'processing'}>Processing</MenuItem>
                  <MenuItem value={'canceled'}>Canceled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

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
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      orders.map((row: { id: string }) => row.id)
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
                        onDeleteRow={() => handleDeleteRow(String(row.id))}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, orders.length)}
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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IOrder[] | any;
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { name, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index] as const);

  stabilizedThis.sort((a: number[], b: number[]) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (name) {
    inputData = inputData.filter((order: IOrder) =>
      ((order?.user?.firstName || '') + ' ' + (order?.user?.lastName || ''))
        .toLocaleLowerCase()
        .includes(name.toLocaleLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter(
      (order: IOrder) => order.orderStatus.toLocaleLowerCase() === status.toLocaleLowerCase()
    );
  }

  return inputData;
}
