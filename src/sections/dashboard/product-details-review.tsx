import sumBy from 'lodash/sumBy';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fShortenNumber } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
// types
import { IProductReview } from 'src/types/product';
//
import ProductReviewList from './product-review-list';

// ----------------------------------------------------------------------

type Props = {
  reviews: IProductReview[];
};

export default function ProductDetailsReview({ reviews }: Props) {
  const review = useBoolean();

  return (
    <Stack
      direction="column"
      sx={{
        mb: 5,
        mt: 5,
        p: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        border: '1px solid #f4f6f8',
      }}
    >
      <Typography sx={{ p: 2 }} variant="h5">
        Latest Reviews
      </Typography>

      <Divider />

      <ProductReviewList reviews={reviews} />
    </Stack>
  );
}
