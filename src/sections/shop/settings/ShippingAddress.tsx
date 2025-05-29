'use client';
import { useAuthContext } from '@/auth/hooks';
import { AddAddressDialog } from '@/components/custom-dialog/add-addriss-dialog';
import Iconify from '@/components/iconify';
import Label from '@/components/label';
import axiosInstance from '@/utils/axios';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ShippingAddress = () => {
  const [open, setOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<any>(null);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.settings) {
      setCurrentSettings(user.settings.shipping_Address);
    }
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteShipping = async (address: string) => {
    const filterAds = currentSettings.filter((addr: any) => addr.address !== address);
    setCurrentSettings(currentSettings.filter((addr: any) => addr.address !== address));
    try {
      const response = await axiosInstance.patch(`/v1/sellers/${user?.settings?.id}`, {
        ...user?.settings,
        shipping_Address: [...filterAds],
      });

      if (response.status === 200) {
        toast.success('Address deleted successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Shipping Addresses</Typography>
        <Button
          onClick={handleOpen}
          variant="contained"
          startIcon={<Iconify icon="material-symbols:add" width="24" height="24" />}
          sx={{ backgroundColor: 'primary.main' }}
        >
          Add New Address
        </Button>
      </Stack>

      <Stack spacing={2}>
        {currentSettings?.length > 0 &&
          currentSettings?.map((addr: any, idx: any) => (
            <Card key={idx} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Typography variant="subtitle2">{addr.label}</Typography>
                    {addr.isDefault && (
                      <Label color="success" sx={{ fontSize: '0.7rem' }}>
                        Default
                      </Label>
                    )}
                  </Stack>
                  <Typography variant="body2">{addr.name}</Typography>
                  <Typography variant="body2">{addr.address}</Typography>
                  <Typography variant="body2">{addr.city}</Typography>
                  <Typography variant="body2">{addr.country}</Typography>
                  <Typography variant="body2">Phone: {addr.phone}</Typography>
                </Box>

                <Stack spacing={1} alignItems="flex-end">
                  <Button
                    startIcon={<Iconify icon="cuida:edit-outline" width="24" height="24" />}
                    size="small"
                    sx={{ textTransform: 'none', color: 'primary.main' }}
                    onClick={() => {
                      setCurrentAddress(addr);
                      handleOpen();
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<Iconify icon="material-symbols:delete" width="24" height="24" />}
                    size="small"
                    color="inherit"
                    onClick={() => handleDeleteShipping(addr.address)}
                    sx={{ textTransform: 'none', color: '#6b7280' }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))}
      </Stack>
      <AddAddressDialog
        open={open}
        onClose={handleClose}
        // onCardAdded={() => {}}
        currentAddress={currentAddress}
      />
    </Box>
  );
};

export default ShippingAddress;
