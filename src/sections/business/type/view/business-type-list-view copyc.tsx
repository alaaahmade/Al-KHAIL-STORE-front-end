'use client';

import { useState } from 'react';

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
import { IBusinessType } from 'src/types/business';

import BusinessTypeDialog from '../business-type-dialog';
import BusinessTypeTableRow from '../business-type-table-row';

const TABLE_HEAD = [
  { id: 'name', label: 'Type Name' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

export default function BusinessTypeListView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterName, setFilterName] = useState('');
  const [businessTypeData, setBusinessTypeData] = useState<IBusinessType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBusinessType, setCurrentBusinessType] = useState<IBusinessType | null>(null);

  const handleCreateBusinessType = async (data: any) => {
    try {
      console.log('Create Business Type:', data);
      setOpenDialog(false);
      // Add your API call here
    } catch (error) {
      console.error(error);
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
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreateBusinessType}
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
                rowCount={businessTypeData.length}
                numSelected={selected.length}
                onSort={(id) => {
                  setOrder(order === 'asc' ? 'desc' : 'asc');
                  setOrderBy(id);
                }}
                onSelectAllRows={(checked) => {
                  if (checked) {
                    setSelected(businessTypeData.map((row) => row.id));
                  } else {
                    setSelected([]);
                  }
                }}
              />

              <TableBody>
                {businessTypeData.map((row) => (
                  <BusinessTypeTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => {}}
                    onDeleteRow={() => {}}
                    onEditRow={() => {
                      setCurrentBusinessType(row);
                      setOpenDialog(true);
                    }}
                  />
                ))}

                <TableNoData notFound={!businessTypeData.length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={businessTypeData.length}
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
