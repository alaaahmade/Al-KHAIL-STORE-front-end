import { fDate } from '@/utils/format-time';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SellerProductList from './seller-product-list';
import Label from '@/components/label';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/redux/hooks';
import { fetchSellers } from '@/redux/slices/SellersSlice';
import axiosInstance from '@/utils/axios';

const MerchantDetailsDialog = ({
  row,
  openDialog,
  closeDialog,
}: {
  row: any;
  openDialog: boolean;
  closeDialog: () => void;
}) => {
  const [status, setStatus] = useState('');
  const dispatch = useAppDispatch();
  const statusOptions = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'PENDING', label: 'PENDING' },
    { value: 'BANNED', label: 'BANNED' },
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(row.user.status);
  }, [row]);

  const handleChange = (event: any) => {
    setStatus(event.target.value);
  };

  const handelChangeStatus = async () => {
    try {
      setLoading(true);
      // await dispatch(updateUser({ id: row.user!.id, data: { status } }));
      const response = await axiosInstance.patch('/users/merchants/status', {
        id: row.user!.id,
        status,
      });
      await dispatch(fetchSellers());
      toast.success(response.data.message);
      closeDialog();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>Seller & Store Details</DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
          {/* User Card */}
          <Card sx={{ minWidth: 260, flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  src={row.user.photo}
                  alt={row.user.firstName}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6">
                    {row.user.firstName} {row.user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.user.phoneNumber}
                  </Typography>
                  <Label
                    variant="soft"
                    color={
                      (row?.user?.status === 'ACTIVE' && 'success') ||
                      (row?.user?.status === 'PENDING' && 'warning') ||
                      (row?.user?.status === 'BANNED' && 'error') ||
                      'default'
                    }
                    sx={{ p: '0 1em', borderRadius: 50 }}
                  >
                    {row.user?.status}
                  </Label>
                  <Stack
                    mt={3}
                    width={'100%'}
                    minWidth={300}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Age"
                        size="small"
                        onChange={handleChange}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <LoadingButton
                      onClick={handelChangeStatus}
                      variant="contained"
                      disabled={status === row.user.status}
                      loading={loading}
                    >
                      Save
                    </LoadingButton>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          {/* Store Card */}
          <Card sx={{ minWidth: 260, flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={row.store.logo} alt={row.store.name} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="h6">{row.store.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.store.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.store.phoneNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.store.address}
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">{row.store.description}</Typography>
              <Typography variant="caption" color="text.secondary">
                Since {fDate(row.store.createdAt)}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
        {/* Product List */}
        <SellerProductList products={row.store.products} />
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDetailsDialog;
