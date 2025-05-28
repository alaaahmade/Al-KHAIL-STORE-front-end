import { Avatar, Box, Button, Paper, Rating, Stack, Typography, ImageList, ImageListItem, ImageListItemBar, Modal } from '@mui/material';
import { useState } from 'react';
import { ReviewSummary } from './comments-summary';
import { ReviewForm } from './comment-form';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function ReviewImages({ files = [] }: { files: any[] }) {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!files.length) return null;

  const handleOpen = (url: string) => {
    setSelectedImg(url);
    setOpen(true);
  };

  return (
    <>
      <ImageList cols={3} gap={8} sx={{ mt: 1, maxWidth: 400 }}>
        {files
          .filter(file => file.type === 'image')
          .map((file, idx) => (
            <ImageListItem key={idx} sx={{ cursor: 'pointer' }} onClick={() => handleOpen(file.url)}>
              <img
                src={file.url}
                alt={file.text || `review image ${idx + 1}`}
                loading="lazy"
                style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: 100 }}
              />
              {file.text && (
                <ImageListItemBar
                  title={file.text}
                  position="below"
                  sx={{ fontSize: 12, textAlign: 'center', mt: 0.5 }}
                />
              )}
            </ImageListItem>
          ))}
      </ImageList>
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <img src={selectedImg || ''} alt="Full size" style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: 12 }} />
        </Box>
      </Modal>
    </>
  );
}

export function CustomerReviews({Reviews, reviewSummary}: any) {
  const {productId }= useParams()
  
  return (
    <Box sx={{ mt: 2, px: 6, py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h6">Customer Reviews</Typography>
        <Button component={Link} href={`/shop/products/review/${productId}`} size="small" color="primary">See All Reviews</Button>
      </Stack>
      <ReviewSummary reviewSummary={reviewSummary} />
      <Box>
        { Reviews?.length > 0 ? 
         Reviews?.map((review: any, idx: number) => (
          <Paper key={idx} sx={{ p: 2, mb: 2, background: '#fafaff', borderRadius: 3 }}>
            <Stack direction="row" spacing={2}>
              <Avatar src={review.user?.photo} />
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">{review.user?.firstName}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">Verified Purchase</Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>{review.text}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">{review.content}</Typography>
                </Stack>
                {/* Images grid for review.files */}
                {review.files && Array.isArray(review.files) && review.files.some(f => f.type === 'image') && (
                  <ReviewImages files={review.files} />
                )}
                {review.reply && (
                  <Paper sx={{ p: 1, mt: 1, background: '#f5f5f7', borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={review.reply.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{review.reply.user}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{review.reply.text}</Typography>
                    </Stack>
                  </Paper>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>{review.date}</Typography>
            </Stack>
          </Paper>
        ))
        : <Typography>
          No Reviews Found.
        </Typography>
      }
      </Box>
      <ReviewForm />
    </Box>
  );
}