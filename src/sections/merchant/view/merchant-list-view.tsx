'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  Pagination,
} from '@mui/material';
import { Icon } from '@iconify/react';
import SellerTableRow from '../seller-tabel-row';
import { CreateAdDialog } from 'src/components/custom-dialog/createAdDialog';
import { useAppDispatch } from '@/redux/hooks';
import { createSeller } from '@/redux/slices/SellersSlice';

export const statusColors: Record<string, string> = {
  Active: 'success',
  Pending: 'warning',
  Suspended: 'error',
};

export default function MerchantListView({ sellers }: { sellers: any[] }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const rowsPerPage = 10;
  const dispatch = useAppDispatch();
  const summaryStats = [
    {
      label: 'Total Merchants',
      value: sellers.length,
      icon: 'fa6-solid:store',
      color: 'rgba(252, 231, 243, 1)',
      iconColor: '#d72660',
    },
    {
      label: 'Active Merchants',
      value: sellers.filter((m) => m.isActive).length,
      icon: 'mdi:check-circle',
      color: 'rgba(209, 250, 229, 1)',
      iconColor: '#059669',
    },
    {
      label: 'Pending Merchant',
      value: sellers.filter((m) => !m.isActive).length,
      icon: 'mdi:clock',
      color: 'rgba(254, 243, 199, 1)',
      iconColor: '#d97706',
    },
    {
      label: 'Suspended',
      value: sellers.filter((m) => m.status === 'suspended').length,
      icon: 'mdi:denied',
      color: 'rgba(254, 226, 226, 1)',
      iconColor: '#dc2626',
    },
  ];
  const filtered = sellers.filter(
    (m) =>
      (status === 'All' ||
        m.isActive === Boolean(status === 'Active') ||
        !m.isActive === Boolean(status === 'Pending')) &&
      (m?.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        m?.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        m?.store?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = async (data) => {
    try {
      await dispatch(createSeller(data));
      setOpenCreate(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 4, mt: -4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Merchant Management
      </Typography>
      <Grid container spacing={2} mb={3}>
        {summaryStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: stat.color,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon={stat.icon} width={22} height={22} color={stat.iconColor} />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Merchant List
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              '&:hover': { bgcolor: '#7c2ee6' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => setOpenCreate(true)}
          >
            Add New Merchant
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={2} px={2} pb={2}>
          <TextField
            size="small"
            placeholder="Search merchants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:magnify" width={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 260 }}
          />
          <Select
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Merchant</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((m) => (
                <SellerTableRow key={m.id} row={m} />
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No merchants found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" alignItems="center" p={2}>
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      </Card>
      <CreateAdDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        handleSave={handleCreate}
      />
    </Container>
  );
}
