import { Box, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export function ReviewForm() {
  const [rating, setRating] = useState<number | null>(0);
  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 3, background: '#fff' }}>
      <Typography variant="subtitle2">Write a Review</Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <Typography variant="body2">Rating:</Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
      </Stack>
      <TextField multiline minRows={3} fullWidth placeholder="Share your experience with this product..." sx={{ mt: 2 }} />
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button sx={{
          color: '#fff',
          border: '1px solid transparent',
          '&:hover': {
            bgcolor: 'transparent',
            borderColor: '#DB2777',
            color: '#DB2777'
          }
        }} variant="contained" color="primary">Submit Review</Button>
      </Stack>
    </Box>
  );
}
