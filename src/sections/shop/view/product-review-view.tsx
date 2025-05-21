'use client'

import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Button, Avatar, LinearProgress, Stack, Pagination, MenuItem, Select, FormControl, InputLabel, Chip, CircularProgress, Alert, ListItemText, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { LoadingScreen } from '@/components/loading-screen';
import { redirect } from 'next/navigation';
import { ReviewItem } from '@/sections/reviews/review-item';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCommentReply, fetchCommentsByProduct, fetchLatestReviews } from '@/redux/slices/reviewsSlice';
import { useAuthContext } from '@/auth/hooks';

// Helper to compute summary from reviews
function getReviewSummary(reviews: any[]) {
  const total = reviews.length;
  const breakdown = [1, 2, 3, 4, 5].map(star => ({ stars: star, count: 0 }));
  let sum = 0;
  reviews.forEach(r => {
    sum += r.rating;
    const idx = breakdown.findIndex(b => b.stars === r.rating);
    if (idx !== -1) breakdown[idx].count += 1;
  });
  const average = total ? (sum / total) : 0;
  const breakdownPercent = breakdown.map(b => ({
    stars: b.stars,
    percent: total ? Math.round((b.count / total) * 100) : 0,
  })).reverse();
  return { average: average.toFixed(1), total, breakdown: breakdownPercent };
}

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

export default function ProductReviewView({ productId }: { productId: string }) {
  const {productReviews, loading, error} = useAppSelector(state => state.reviewsSlice)
  const [reviews, setReviews] = useState<any[]>([]);
  const [displayReplyInput, setDisplayReplyInput] = useState(null)

  const [replyContent, setReplyContent] = useState<string>('')

  const {user} = useAuthContext()

  useEffect(() => {
    // setLoading(true);
    // setError(null);
    // fetch(`http://localhost:3000/api/v1/reviews/product/${productId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.status === 'success') {
          
    //       console.log(data.data);
    //       if(data.data.length < 1) {
    //         redirect('/shop/products/1')
    //       }
    //       setReviews(data.data);
    //     } else {
    //       setError('Failed to load reviews');
    //     }
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     setError('Failed to load reviews');
    //     setLoading(false);
    //   });
    dispatch(fetchCommentsByProduct(productId))
  }, [productId]);
  useEffect(() => {
    if(productReviews) {
      setReviews(productReviews)
    }
  }, [productReviews])

  const reviewSummary = getReviewSummary(reviews);

    const dispatch = useAppDispatch()
    // changeCommentReplyField
  
  
    const handleAddReply = async(commentId: string) => {
      if (replyContent.trim().length > 0 ) {
        await dispatch(createCommentReply({
          content: replyContent,
          commentId: commentId,
          userId: user?.id
        }))
        setReplyContent('')
        await dispatch(fetchCommentsByProduct(productId))
      }
      return;
    }

  if (loading) return <LoadingScreen/>


  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: '#fafbfc', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ArrowBackIosNewIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
        <Typography variant="body2" color="grey.600">
          <span style={{ cursor: 'pointer', color: '#888' }}>Back to Products</span> &nbsp; &gt; &nbsp; Skincare &nbsp; &gt; &nbsp;
          <span style={{ color: '#d72660' }}>{reviews[0]?.product?.productName}</span>
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Left: Review Summary */}
        <Card sx={{ width: 320, p: 3, alignSelf: 'flex-start' }}>
          <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>{reviewSummary.average}</Typography>
            <Box sx={{ ml: 1 }}>
              <ReviewStars value={Math.round(+reviewSummary.average)} />
            </Box>
          </Box>
          <Typography variant="caption" color="grey.600" sx={{ mb: 2, display: 'block' }}>
            Based on {reviewSummary.total} reviews
          </Typography>
          <Box sx={{ mb: 2 }}>
            {reviewSummary.breakdown.map((item) => (
              <Box key={item.stars} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography sx={{ width: 20, fontSize: 13 }}>{item.stars}</Typography>
                <StarIcon sx={{ fontSize: 15, color: '#fbc02d', mr: 1 }} />
                <LinearProgress variant="determinate" value={item.percent} sx={{ flex: 1, height: 7, borderRadius: 5, mx: 1 }} />
                <Typography sx={{ width: 28, fontSize: 13 }}>{item.percent}%</Typography>
              </Box>
            ))}
          </Box>
          <Button
          component={'a'}
          href={`/products/${productId}`}
          variant="contained" color="secondary" fullWidth sx={{ borderRadius: 8, mt: 2, background: '#d72660', color:'#fff',':hover': { background: '#c2185b' } }}>
            Write a Review
          </Button>
        </Card>

        {/* Right: Reviews List */}
        <Box sx={{ flex: 1 }}>
          {/* Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Most Recent</InputLabel>
              <Select label="Most Recent" defaultValue="recent">
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="highest">Highest Rated</MenuItem>
                <MenuItem value="lowest">Lowest Rated</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>All Stars</InputLabel>
              <Select label="All Stars" defaultValue="all">
                <MenuItem value="all">All Stars</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>10 Reviews</InputLabel>
              <Select label="10 Reviews" defaultValue={10}>
                <MenuItem value={10}>10 Reviews</MenuItem>
                <MenuItem value={20}>20 Reviews</MenuItem>
                <MenuItem value={50}>50 Reviews</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Review Cards */}
          <Stack spacing={3}>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Avatar src={review.user?.photo} sx={{ width: 44, height: 44, mr: 2 }} />
                  {/* <L */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <ListItemText
                        primary={review.user.firstName + ' ' + review.user.lastName}
                        secondary={<Stack direction={'row'}
                          alignItems={'center'}
                          justifyContent={'flex-start'}
                          spacing={1}
                        >
                          <ReviewStars value={review.rating} />
                          <Typography sx={{fontSize: 12}} >(Verified Purchase)</Typography>

                        </Stack>}
                      />                      
                      {/* Optionally add 'Verified Purchase' if your API supports it */}
                      <Typography variant="caption" sx={{ ml: 'auto', color: 'grey.600' }}>{new Date(review.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    <Typography sx={{ mb: 1 }}>{review.content}</Typography>
                  </Box>
                  </Box>
                    {displayReplyInput === review.id && 
                    <Stack direction="column" spacing={2} sx={{ p: 3, pt: 1.5 }}>
                      {review?.commentReplies?.length > 0 && review?.commentReplies?.map((comment: any) => (
                        <ReviewItem key={comment.id} review={comment} />
                      ))}
                
                      <Stack direction={'row'} spacing={2} sx={{}}>
                        <TextField
                          size="small"
                          sx={{p: 0, height: 10}}
                          fullWidth
                          placeholder="Write a response..." 
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                
                        <Button
                          sx={{
                            flexShrink: 0,
                            bgcolor: 'primary.main',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: 'background.neutral',
                              color: 'text.primary',
                
                            },
                          }}
                          onClick={() => {
                            handleAddReply(review.id)
                          }}
                          >
                            Reply
                          </Button>
                      </Stack>
                      </Stack>}

                    <Button
                    size='small'>HelpFul</Button>
                    <Button
                    onClick={() => setDisplayReplyInput(review.id)}
                    
                    size='small'>Reply</Button>
              </Card>
            ))}
          </Stack>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination sx={{color: '#fff'}} count={12} page={1} color="primary" shape="rounded" />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
