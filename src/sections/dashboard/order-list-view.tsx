'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
// _mock
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
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
import { IOrderItem } from 'src/types/order';
//
import OrderTableRow from './order-table-row';
import { Toolbar, Typography } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'orderNumber', label: 'Order ID', width: 100 },
  { id: 'name', label: 'Customer', width: 200 },
  { id: 'product', label: 'Product', width: 200 },
  { id: 'amount', label: 'Amount', width: 130,},
  { id: 'status', label: 'Status', width: 150 },
];

// ----------------------------------------------------------------------

export default function OrderListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });


  const orders = useAppSelector((state) => state.ordersSlice.orders);
  

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(orders);


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 52 : 72;

  const notFound = (!dataFiltered.length)
  useEffect(() => {
    setTableData(orders);
  }, [orders]);

  return (
    <>
        <Container maxWidth={false} sx={{ p: 0 }}>
        <Card 
          sx={{
            p: 0,
          }}
        >
        <Toolbar
        sx={{
          p: '2em',
          border: '1px solid #f4f6f8',
        }}
      >
        
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Recent Orders
          </Typography>
    
        
      </Toolbar>

          <TableContainer
            component={Scrollbar}
            sx={{
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <Table
              size={table.dense ? 'small' : 'medium'}
              sx={{
                minWidth: 600,
                tableLayout: 'auto',
              }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: IOrderItem[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  // Sort the data based on the comparator
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1]; // Preserve original order if comparator returns 0
  });

  return stabilizedThis.map((el) => el[0]); 
}

