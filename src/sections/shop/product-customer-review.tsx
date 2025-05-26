import { Avatar, Box, Button, Paper, Rating, Stack, Typography } from '@mui/material';
import { ReviewSummary } from './reviews-summary';
import { ReviewForm } from './review-form';

export function CustomerReviews({Reviews, reviewSummary}: any) {
  
  return (
    <Box sx={{ mt: 2, px: 6, py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h6">Customer Reviews</Typography>
        <Button size="small" color="primary">Write a Review</Button>
      </Stack>
      <ReviewSummary reviewSummary={reviewSummary} />
      <Box>
        {Reviews?.map((review: any, idx: number) => (
          <Paper key={idx} sx={{ p: 2, mb: 2, background: '#fafaff', borderRadius: 3 }}>
            <Stack direction="row" spacing={2}>
              <Avatar src={review.user?.photo} />
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">{review.user?.firstName}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">Verified Purchase</Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>{review.text}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">{review.content}</Typography>
                </Stack>
                {review.reply && (
                  <Paper sx={{ p: 1, mt: 1, background: '#f5f5f7', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={review.reply.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{review.reply.user}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{review.reply.text}</Typography>
                    </Stack>
                  </Paper>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>{review.date}</Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
      <ReviewForm />
    </Box>
  );
}