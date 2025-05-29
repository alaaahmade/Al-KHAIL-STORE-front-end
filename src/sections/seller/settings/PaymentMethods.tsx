// components/PaymentMethods.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import Iconify from '@/components/iconify';
import Label from '@/components/label';
import AddCardForm from './AddCardForm';
import axiosInstance from '@/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'react-toastify';

interface StripeCard {
  card: any;
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  isDefault?: boolean;
}

const cardBrandIcon = (brand: string) => {
  if (!brand) {
    return <Iconify icon="mdi:credit-card-outline" width={40} height={35} />;
  }
  switch (brand?.toLowerCase()) {
    case 'visa':
      return <Iconify color={'#2563eb'} icon="fontisto:visa" width={40} height={35} />;
    case 'mastercard':
      return <Iconify color={'#ea580c'} icon="cib:cc-mastercard" width={40} height={35} />;
    // Add more brands if needed
    default:
      return <Iconify icon="mdi:credit-card-outline" width={40} height={35} />;
  }
};

const PaymentMethods = () => {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<StripeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirm = useBoolean();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/v1/payments/payment-methods');
      const fetchedCards = res.data;

      setCards(fetchedCards);
    } catch (err: any) {
      setError('Failed to fetch cards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleCardAdded = () => {
    fetchCards();
    handleCloseDialog();
  };

  const handleDeleteCard = async (id: string) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/v1/payments/payment-methods/${id}`);
      await fetchCards();
      toast.success('Card deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete card.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Card sx={{ p: 4 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Payment Methods
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="material-symbols:add" />}
            sx={{ borderRadius: 1, textTransform: 'none', px: 3, bgcolor: 'primary.main' }}
            onClick={handleOpenDialog}
          >
            Add New Card
          </Button>
        </Stack>

        {/* Saved Cards */}
        {loading ? (
          <Typography>Loading cards...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Stack spacing={2}>
            {cards.length === 0 && <Typography color="text.secondary">No cards saved.</Typography>}
            {cards.map((card) => (
              <Card
                key={card?.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  borderColor: 'divider',
                  backgroundColor: '#F9FAFB',
                  position: 'relative',
                }}
              >
                <Stack direction="row" spacing={1} mt={1} alignItems={'center'} gap={2}>
                  {cardBrandIcon(card?.card?.brand)}
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {card?.card?.brand?.charAt(0).toUpperCase() + card?.card?.brand?.slice(1)}{' '}
                      ending in {card?.card?.last4}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exp: {card?.card?.exp_month?.toString().padStart(2, '0')}/
                      {card?.card?.exp_year}
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  alignItems={'center'}
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                >
                  {card?.card?.isDefault && (
                    <Label sx={{ p: 2, borderRadius: 50 }} color="success">
                      Default
                    </Label>
                  )}
                  <IconButton
                    disabled={deletingId === card?.id}
                    onClick={() => {
                      setPendingDeleteId(card?.id);
                      console.log(card?.id);
                      confirm.onTrue();
                    }}
                  >
                    <Iconify icon="mynaui:trash" color="error.main" width={25} height={25} />
                  </IconButton>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Other Methods */}
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Other Payment Methods
        </Typography>

        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">PayPal</Typography>
            <Button variant="outlined" color="error" sx={{ textTransform: 'none' }}>
              Disconnect
            </Button>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">Apple Pay</Typography>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>
              Connect
            </Button>
          </Box>
        </Stack>
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Card"
        content="Are you sure you want to delete this Card?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteCard(`${pendingDeleteId}`);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />

      <AddCardForm open={open} onClose={handleCloseDialog} onCardAdded={handleCardAdded} />
    </>
  );
};

export default PaymentMethods;
