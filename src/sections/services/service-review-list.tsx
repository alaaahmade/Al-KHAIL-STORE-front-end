// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
// import { IServiceReview } from 'src/types/product';
//
import { IServicesReview } from 'src/types/services';
import { useEffect, useState } from 'react';
import ProductReviewItem from './service-review-item';

// ----------------------------------------------------------------------

type Props = {
  reviews: IServicesReview[];
};

export default function ProductReviewList({ reviews }: Props) {

  const reviewsberPage = 5;
  const [page, setPage] = useState(1);
  const [currentReviews, setCurrentRe] = useState(reviews);   
  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); 
  }
  const startIndex = (page - 1) * reviewsberPage;
  const endIndex = startIndex + reviewsberPage; 
  const paginatedReviews = reviews.slice(startIndex, endIndex); 
  const totalPages = Math.ceil(reviews.length / reviewsberPage);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); 
  };

  useEffect(() => {
    setCurrentRe(paginatedReviews); 
  }, [reviews, page]);   

  return (
    <>
      {paginatedReviews.map((review) => (
        <ProductReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}
