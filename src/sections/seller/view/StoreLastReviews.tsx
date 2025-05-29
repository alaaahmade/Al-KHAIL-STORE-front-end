import React from 'react';
import { Box, Card, Typography, Stack, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Helper to render stars
const ReviewStars = ({ value }: { value: number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {[1, 2, 3, 4, 5].map((star) =>
      value >= star ? (
        <StarIcon key={star} color="warning" fontSize="small" />
      ) : (
        <StarBorderIcon key={star} color="warning" fontSize="small" />
      )
    )}
  </Box>
);

interface StoreLastReviewsProps {
  products: any[];
  max?: number;
}

export default function StoreLastReviews({ products, max = 5 }: StoreLastReviewsProps) {
  // Aggregate all comments from products, attach product info
  const allComments = products.flatMap((product) =>
    (product.comments || []).map((comment: any) => ({
      ...comment,
      productName: product.productName,
      productImage: product.productImage,
      productId: product.id,
    }))
  );

  // Sort by createdAt (latest first)
  const sorted = allComments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const displayComments = sorted.slice(0, max);

  if (displayComments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No reviews yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {displayComments.map((review) => (
        <Card key={review.id} sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            src={review.productImage}
            alt={review.productName}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {review.productName}
              </Typography>
              <ReviewStars value={review.rating} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {review.content}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Card>
      ))}
    </Stack>
  );
}
