import { useAuthContext } from '@/auth/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { createReviews } from '@/redux/slices/reviewsSlice';
import { fetchServiceById } from '@/redux/slices/serviceSlice';
import { Box, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function ReviewForm() {
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState('');
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const {productId} = useParams()
  const {user} = useAuthContext()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      await dispatch(createReviews({
        rating,
        content: review,
        productId,
        userId: user?.id
      }))
      dispatch(fetchServiceById(productId))
      toast.success('Review added successfully')
    } catch (error) {
      toast.error('Failed to add review')
    }
  };
  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 3, background: '#fff' }}>
      <Typography variant="subtitle2">Write a Review</Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <Typography variant="body2">Rating:</Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
      </Stack>
      <TextField multiline minRows={3} fullWidth placeholder="Share your experience with this product..." value={review} onChange={(e) => setReview(e.target.value)} sx={{ mt: 2 }} />
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button sx={{
          color: '#fff',
          border: '1px solid transparent',
          '&:hover': {
            bgcolor: 'transparent',
            borderColor: '#DB2777',
            color: '#DB2777'
          }
        }} variant="contained" color="primary" onClick={handleSubmit}>Submit Review</Button>
      </Stack>
    </Box>
  );
}
