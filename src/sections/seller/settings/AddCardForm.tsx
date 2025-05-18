'use client';
import axiosInstance from '@/utils/axios';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import Iconify from '@/components/iconify';

interface AddCardFormProps {
  onCardAdded?: () => void;
  open: boolean;
  onClose: () => void;
}

const AddCardForm = ({ onCardAdded, open, onClose }: AddCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // UI fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setError(null);
        const res = await axiosInstance.post('/v1/payments/setup-intent');
        if (res.data && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          setError('No client secret returned from server.');
        }
      } catch (err: any) {
        setError('Failed to fetch setup intent: ' + (err?.response?.data?.message || err.message));
        console.error('Failed to fetch setup intent:', err);
      }
    };

    fetchClientSecret();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!stripe) {
      setError('Stripe.js has not loaded. Make sure AddCardForm is wrapped in <Elements>.');
      return;
    }
    if (!elements) {
      setError('Stripe Elements not loaded.');
      return;
    }
    if (!clientSecret) {
      setError('No setup intent client secret.');
      return;
    }
    setLoading(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('CardElement not found.');
        setLoading(false);
        return;
      }
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      console.log('Stripe confirmCardSetup result:', result);
      if (result.error) {
        setError(result.error.message || 'An error occurred while adding the card.');
      } else {
        setSuccess(true);
        setError(null);
        if (typeof onCardAdded === 'function') {
          onCardAdded(); // Refresh card list
        }
      }
      toast.success('Card added successfully');
    } catch (err: any) {
      setError('Unexpected error: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 16, padding: 0 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <span style={{ fontWeight: 500, fontSize: 18 }}>Add New Card</span>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <Iconify icon="ic:round-close" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <form id="add-card-form" onSubmit={handleSubmit}>
          <div style={{ margin: '10px 0 18px 0' }}>
            <label style={{ fontSize: 14, color: '#888', marginBottom: 6, display: 'block', fontWeight: 500 }}>
              Card Details
            </label>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                padding: '14px 16px',
                background: '#fafafd',
                display: 'flex',
                alignItems: 'center',
                minHeight: 54,
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
              }}
            >
              <Icon icon="mdi:credit-card-outline" style={{ color: '#b0b0b0', fontSize: 22, marginRight: 8 }} />
              <div style={{ flex: 1 }}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#232323',
                        '::placeholder': { color: '#b0b0b0' },
                        fontFamily: 'inherit',
                        iconColor: '#D72660',
                        backgroundColor: 'transparent',
                      },
                      invalid: {
                        color: '#e53935',
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
            </div>
          </div>
          <TextField
            label="Cardholder Name"
            placeholder="Name on card"
            fullWidth
            margin="normal"
            value={cardholder}
            onChange={e => setCardholder(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                color="primary"
              />
            }
            label={<span style={{ fontSize: 14 }}>Set as default payment method</span>}
            sx={{ mt: 1, mb: 0.5 }}
          />

          {error && (
            <div style={{ color: 'red', marginTop: 12, fontSize: 13 }}>{error}</div>
          )}
          {success && (
            <div style={{ color: 'green', marginTop: 12, fontSize: 13 }}>Card added successfully!</div>
          )}
        </form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          form="add-card-form"
          sx={{
            backgroundColor: '#D72660',
            '&:hover': { backgroundColor: '#b51e4e' },
            borderRadius: 2,
            minWidth: 120,
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 500,
          }}
          disabled={loading || !stripe || !clientSecret}
        >
          {loading ? 'Adding...' : 'Add Card'}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#b0b0b0',
            color: '#333',
            borderRadius: 2,
            minWidth: 120,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCardForm;
