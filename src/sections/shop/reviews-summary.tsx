import { Box, Chip, Rating, Stack, Typography } from '@mui/material';

export function ReviewSummary({reviewSummary}: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0, mb: 2, width: '100%' }}>
      <Box sx={{ width: '50%', px: 4, py: 2, boxSizing: 'border-box', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>{reviewSummary.average}</Typography>
        <Rating value={reviewSummary.average} precision={0.1} readOnly size="large" />
        <Typography variant="caption" color="text.secondary">
          Based on {reviewSummary.total} reviews
        </Typography>
      </Box>
      <Box sx={{ width: '50%', px: 4, py: 2, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {reviewSummary.breakdown.map((row: any) => (
          <Stack sx={{ width: '100%' }} key={row.stars} direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">{row.stars}★</Typography>
            <Box sx={{ width: '100%', height: 8, bgcolor: '#eee', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ width: `${row.percent}%`, height: 8, bgcolor: '#E91E63' }} />
            </Box>
            <Typography variant="caption" color="text.secondary">{row.percent}%</Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}