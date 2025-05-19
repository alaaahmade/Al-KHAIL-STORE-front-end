import { Box, Chip, Rating, Stack, Typography } from '@mui/material';

export function ReviewSummary({reviewSummary}: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, mb: 2 }}>
      <Box sx={{ minWidth: 90 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>{reviewSummary.average}</Typography>
        <Rating value={reviewSummary.average} precision={0.1} readOnly size="large" />
        <Typography variant="caption" color="text.secondary">
          Based on {reviewSummary.total} reviews
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        {reviewSummary.breakdown.map((row: any) => (
          <Stack key={row.stars} direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2">{row.stars}★</Typography>
            <Box sx={{ width: 120, height: 8, bgcolor: '#eee', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ width: `${row.percent}%`, height: 8, bgcolor: '#E91E63' }} />
            </Box>
            <Typography variant="caption" color="text.secondary">{row.percent}%</Typography>
          </Stack>
        ))}
      </Box>
      <Box>
        <Typography variant="subtitle2">Review Highlights</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
          {reviewSummary.highlights.map((h: any) => (
            <Chip key={h.label} label={`${h.label} (${h.count})`} size="small" />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}