// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
// types
// import { IProductReview } from 'src/types/product';
//
import { IServicesReview } from 'src/types/services';
import ProductReviewList from './service-review-list';
import ProductReviewNewForm from './service-review-new-form';

// ----------------------------------------------------------------------

type Props = {
  totalRatings: number;
  totalReviews: number;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  reviews: IServicesReview[];
};

export default function ProductDetailsReview({
  totalRatings,
  totalReviews,
  ratings,
  reviews,
}: Props) {
  const review = useBoolean();

    console.log(totalReviews);
    
  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Average rating</Typography>

      <Typography variant="h2">{totalRatings}/5</Typography>

      <Rating readOnly value={totalRatings} precision={0.1} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        ({fShortenNumber(totalReviews)} reviews)
      </Typography>
    </Stack>
  );



  return (
    <Box
    sx={{
      m: 5,
    }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reviews
      </Typography>
      <Box

        sx={{
          py: { xs: 5, md: 0 },
        }}
      >
        {renderSummary}
        
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ProductReviewList reviews={reviews} />

      <ProductReviewNewForm open={review.value} onClose={review.onFalse} />
    </Box>
  );
}
