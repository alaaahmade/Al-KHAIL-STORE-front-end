// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
import { IProductReview } from 'src/types/product';
//
import ProductReviewItem from './reviews-review-item';

// ----------------------------------------------------------------------

type Props = {
  reviews: IProductReview[];
};

export default function ProductReviewList({ reviews }: Props) {
  return (
    <>
      {reviews.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}
    </>
  );
}
