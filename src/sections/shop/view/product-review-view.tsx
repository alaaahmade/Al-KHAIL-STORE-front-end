'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Stack,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  ListItemText,
  TextField,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { LoadingScreen } from '@/components/loading-screen';
import { redirect, useRouter } from 'next/navigation';
import { ReviewItem } from '@/sections/reviews/review-item';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCommentReply, fetchCommentsByProduct } from '@/redux/slices/reviewsSlice';
import { useAuthContext } from '@/auth/hooks';

// Helper to compute summary from reviews
function getReviewSummary(reviews: any[]) {
  const total = reviews.length;
  const breakdown = [1, 2, 3, 4, 5].map((star) => ({ stars: star, count: 0 }));
  let sum = 0;
  reviews.forEach((r) => {
    sum += r.rating;
    const idx = breakdown.findIndex((b) => b.stars === r.rating);
    if (idx !== -1) breakdown[idx].count += 1;
  });
  const average = total ? sum / total : 0;
  const breakdownPercent = breakdown
    .map((b) => ({
      stars: b.stars,
      percent: total ? Math.round((b.count / total) * 100) : 0,
    }))
    .reverse();
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

import axiosInstance from '@/utils/axios';
import { deleteFileFromS3 } from '@/utils/file';
import Iconify from '@/components/iconify';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import ReviewImages from './review-images';

export default function ProductReviewView({ productId }: { productId: string }) {
  // ... existing state declarations ...

  // File upload logic for reply
  const handleReplyFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setReplyUploading(true);
    const uploaded: { url: string; type: string; text?: string }[] = [];
    const captions: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const data = await axiosInstance.post('/v1/files/upload', formData);
        const url = data.data.url;
        const type = file.type.startsWith('image')
          ? 'image'
          : file.type.startsWith('video')
            ? 'video'
            : 'file';
        uploaded.push({ url, type });
        captions.push('');
      } catch (err) {
        // Toast error just like comment-form
        if (typeof window !== 'undefined') {
          // @ts-ignore
          import('react-toastify').then(({ toast }) =>
            toast.error(`Failed to upload file: ${file.name}`)
          );
        }
      }
    }
    setReplyFiles((prev) => [...prev, ...uploaded]);
    setReplyFileCaptions((prev) => [...prev, ...captions]);
    setReplyUploading(false);
    e.target.value = '';
  };

  const handleReplyCaptionChange = (idx: number, value: string) => {
    setReplyFileCaptions((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setReplyFiles((prev) => {
      const next = [...prev];
      next[idx].text = value;
      return next;
    });
  };

  const handleRemoveReplyFile = async (idx: number) => {
    const fileToDelete = replyFiles[idx];
    if (fileToDelete && fileToDelete.url) {
      try {
        await deleteFileFromS3(fileToDelete.url);
      } catch (err) {
        if (typeof window !== 'undefined') {
          toast.error('Failed to delete file from server.');
        }
      }
    }
    setReplyFiles((prev) => prev.filter((_, i) => i !== idx));
    setReplyFileCaptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const { productReviews, loading, error } = useAppSelector((state) => state.reviewsSlice);
  const [reviews, setReviews] = useState<any[]>([]);
  const [displayReplyInput, setDisplayReplyInput] = useState(null);

  // Pagination and filter states
  const [selectedSort, setSelectedSort] = useState<'recent' | 'oldest' | 'highest' | 'lowest'>(
    'recent'
  );
  const [selectedStar, setSelectedStar] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');
  const [reviewsPerPage, setReviewsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [replyContent, setReplyContent] = useState<string>('');
  const [replyFiles, setReplyFiles] = useState<{ url: string; type: string; text?: string }[]>([]);
  const [replyFileCaptions, setReplyFileCaptions] = useState<string[]>([]);
  const [replyUploading, setReplyUploading] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    dispatch(fetchCommentsByProduct(productId));
  }, [productId]);
  useEffect(() => {
    if (productReviews) {
      setReviews(productReviews);
    }
  }, [productReviews]);

  // Filtered and sorted reviews
  const filteredReviews = reviews
    .filter((r) => (selectedStar === 'all' ? true : r.rating === selectedStar))
    .sort((a, b) => {
      if (selectedSort === 'recent')
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (selectedSort === 'oldest')
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (selectedSort === 'highest') return b.rating - a.rating;
      if (selectedSort === 'lowest') return a.rating - b.rating;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const pagedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const reviewSummary = getReviewSummary(reviews);
  const router = useRouter();
  const dispatch = useAppDispatch();
  // changeCommentReplyField

  const handleAddReply = async (commentId: string) => {
    if (replyContent.trim().length > 0 || replyFiles.length > 0) {
      await dispatch(
        createCommentReply({
          content: replyContent,
          commentId: commentId,
          userId: user?.id,
          files: replyFiles.length > 0 ? replyFiles : undefined,
        })
      );
      setReplyContent('');
      setReplyFiles([]);
      setReplyFileCaptions([]);
      await dispatch(fetchCommentsByProduct(productId));
    }
    return;
  };

  if (loading) return <LoadingScreen />;

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: '#fafbfc', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ArrowBackIosNewIcon sx={{ fontSize: 16, mr: 1, color: 'grey.600' }} />
        <Typography variant="body2" color="grey.600">
          <span
            onClick={() => router.push('/shop/products')}
            style={{ cursor: 'pointer', color: '#888' }}
          >
            Back to Products
          </span>{' '}
          &nbsp; &gt; &nbsp; {reviews[0]?.product?.category[0]?.categoryName || 'review'} &nbsp;
          &gt; &nbsp;
          <span style={{ color: '#d72660' }}>{reviews[0]?.product?.productName}</span>
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        {/* Left: Review Summary */}
        <Card sx={{ width: 320, p: 3, alignSelf: 'flex-start' }}>
          <Typography variant="h6" gutterBottom>
            Customer Reviews
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              {reviewSummary.average}
            </Typography>
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
                <LinearProgress
                  variant="determinate"
                  value={item.percent}
                  sx={{ flex: 1, height: 7, borderRadius: 5, mx: 1 }}
                />
                <Typography sx={{ width: 28, fontSize: 13 }}>{item.percent}%</Typography>
              </Box>
            ))}
          </Box>
          <Button
            component={'a'}
            href={`/shop/products/${productId}`}
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              borderRadius: 8,
              mt: 2,
              background: '#d72660',
              color: '#fff',
              ':hover': { background: '#c2185b' },
            }}
          >
            View Product
          </Button>
        </Card>

        {/* Right: Reviews List */}
        <Box sx={{ flex: 1 }}>
          {/* Filters */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                label="Sort By"
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="highest">Highest Rated</MenuItem>
                <MenuItem value="lowest">Lowest Rated</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="star-label">Stars</InputLabel>
              <Select
                labelId="star-label"
                label="Stars"
                value={selectedStar}
                onChange={(e) => {
                  setSelectedStar(e.target.value as any);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="all">All Stars</MenuItem>
                <MenuItem value={5}>5 Stars</MenuItem>
                <MenuItem value={4}>4 Stars</MenuItem>
                <MenuItem value={3}>3 Stars</MenuItem>
                <MenuItem value={2}>2 Stars</MenuItem>
                <MenuItem value={1}>1 Star</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="perpage-label">Per Page</InputLabel>
              <Select
                labelId="perpage-label"
                label="Per Page"
                value={reviewsPerPage}
                onChange={(e) => {
                  setReviewsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <MenuItem value={10}>10 Reviews</MenuItem>
                <MenuItem value={20}>20 Reviews</MenuItem>
                <MenuItem value={50}>50 Reviews</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Review Cards */}
          <Stack spacing={3}>
            {pagedReviews?.length > 0 ? (
              pagedReviews.map((review) => (
                <Card key={review.id} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Avatar src={review.user?.photo} sx={{ width: 44, height: 44, mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <ListItemText
                          primary={review.user.firstName + ' ' + review.user.lastName}
                          secondary={
                            <Stack
                              direction={'row'}
                              alignItems={'center'}
                              justifyContent={'flex-start'}
                              spacing={1}
                            >
                              <ReviewStars value={review.rating} />
                              <Typography sx={{ fontSize: 12 }}>(Verified Purchase)</Typography>
                            </Stack>
                          }
                        />
                        <Typography variant="caption" sx={{ ml: 'auto', color: 'grey.600' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography sx={{ mb: 1 }}>{review.content}</Typography>
                      {/* Show review images if present */}
                      {review.files &&
                        Array.isArray(review.files) &&
                        review.files.some((f: any) => f.type === 'image') && (
                          <ReviewImages files={review.files} />
                        )}
                    </Box>
                  </Box>
                  {displayReplyInput === review.id && (
                    <Box sx={{ p: 3, pt: 1.5 }}>
                      <Stack direction="column" spacing={2}>
                        {review?.commentReplies?.length > 0 &&
                          review?.commentReplies?.map((comment: any) => (
                            <ReviewItem key={comment.id} review={comment} />
                          ))}
                        <Stack direction="column" spacing={1} sx={{ mt: 1, mb: 1 }}>
                          {replyFiles.map((file, idx) => (
                            <Box
                              key={file.url}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              {file.type === 'image' ? (
                                <img
                                  src={file.url}
                                  alt="uploaded"
                                  width={56}
                                  height={56}
                                  style={{ objectFit: 'cover', borderRadius: 4 }}
                                />
                              ) : file.type === 'video' ? (
                                <video
                                  src={file.url}
                                  width={56}
                                  height={56}
                                  style={{ borderRadius: 4 }}
                                  controls
                                />
                              ) : (
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  File
                                </a>
                              )}
                              <TextField
                                size="small"
                                placeholder="Caption (optional)"
                                value={replyFileCaptions[idx] || ''}
                                onChange={(e) => handleReplyCaptionChange(idx, e.target.value)}
                                sx={{ flex: 1 }}
                                InputProps={{
                                  endAdornment: (
                                    <IconButton onClick={() => handleRemoveReplyFile(idx)}>
                                      <span
                                        style={{ color: '#d32f2f', fontWeight: 600, fontSize: 18 }}
                                      >
                                        ×
                                      </span>
                                    </IconButton>
                                  ),
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                        <Stack direction={'row'} spacing={2} sx={{}}>
                          <TextField
                            size="small"
                            sx={{ p: 0, height: 10 }}
                            fullWidth
                            placeholder="Write a response..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          />
                          <Stack direction={'row'} spacing={1}>
                            <IconButton
                              component="label"
                              size="small"
                              sx={{ p: 0, m: 0, minWidth: 0, minHeight: 0, width: 32, height: 32 }}
                              disabled={replyUploading}
                            >
                              <Iconify icon="stash:image-plus-light" width={24} height={24} />
                              <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                hidden
                                onChange={handleReplyFileChange}
                              />
                            </IconButton>
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
                                handleAddReply(review.id);
                              }}
                            >
                              Reply
                            </Button>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                  <Button size="small">HelpFul</Button>
                  <Button onClick={() => setDisplayReplyInput(review.id)} size="small">
                    Reply
                  </Button>
                </Card>
              ))
            ) : (
              <Stack sx={{ mt: 3 }} alignItems={'center'}>
                <Typography>No Reviews Found.</Typography>
              </Stack>
            )}
          </Stack>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              sx={{ color: '#fff' }}
              count={totalPages}
              page={currentPage}
              onChange={(_, v) => setCurrentPage(v)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
