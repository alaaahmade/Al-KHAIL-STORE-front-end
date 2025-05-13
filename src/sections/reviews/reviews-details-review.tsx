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
import ProductReviewList from './reviews-review-list';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  reviews: IProductReview[];
};

export default function ProductDetailsReview({
  reviews,
}: Props) {
  const dec = useBoolean()
  const [sortedReviews, setSortedReviews] = useState(reviews)
  
  const review = useBoolean();

  const SortDataByDate = (data: any[]) => {
    if (data.length === 0) return;
  
    const sorted = [...data].sort((a: any, b: any) => {
      return dec.value
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  
    setSortedReviews(sorted);
  };
  

  useEffect(() => {
    SortDataByDate(reviews)
  }, [dec.value])

  useEffect(() => {
    setSortedReviews(reviews)
  }, [reviews])


  return (
    <Stack
    direction="column"
    sx={{

      backgroundColor: '#fff',
      borderRadius: 2,
      border: '1px solid #f4f6f8'
     }}
  >
    <Stack direction='row' alignItems='center' justifyContent={'space-between'} sx={{p: 3}}>
    <Typography sx={{p: 3}} variant="h5">Product Reviews</Typography>
     <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
     >
     <IconButton
      sx={{
        color: 'text.secondary',
        bgcolor: 'background.neutral',
        borderRadius: 2,
        gap: 1,
        fontSize: '14px',
        '&:hover': { bgcolor: 'background.neutral' },
      }}
    >
    <Iconify icon="iconoir:filter-solid" />
    filter
    </IconButton>
        <IconButton
      sx={{
        color: 'text.secondary',
        bgcolor: 'background.neutral',
        borderRadius: 2,
        gap: 1,
        fontSize: '14px',
        '&:hover': { bgcolor: 'background.neutral' },

      }}
      onClick={dec.onToggle}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          flexDirection: 'column'
        }}
      >
      <Iconify width={12} icon="bxs:up-arrow" />
      <Iconify width={12} icon="bxs:down-arrow" />
      </Box>

    sort
    </IconButton>
     </Box>
    </Stack>
    <Divider />
      
      <ProductReviewList reviews={sortedReviews} />
      </Stack>
  );
}
