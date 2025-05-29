'sue client';

// @mui
import Stack from '@mui/material/Stack';

// utils
// types
import { IProductReview } from 'src/types/product';
// components
import { Button, TextField } from '@mui/material';
import { ReviewItem } from './review-item';
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';
import { createCommentReply, fetchLatestReviews } from '@/redux/slices/reviewsSlice';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  review: IProductReview;
};

export default function ProductReviewItem({ review }: Props) {
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuthContext();
  const dispatch = useAppDispatch();
  // changeCommentReplyField

  const handleAddReply = async () => {
    if (replyContent.trim().length > 0) {
      await dispatch(
        createCommentReply({
          content: replyContent,
          commentId: review.id,
          userId: user?.id,
        })
      );
      setReplyContent('');
      await dispatch(fetchLatestReviews());
    }
    return;
  };

  const { commentReplies } = review;
  const renderContent = (
    <Stack spacing={2} direction={'column'} sx={{ flex: 1 }}>
      <ReviewItem review={review} />
      <Stack direction="column" spacing={2} sx={{ p: 3, pt: 1.5 }}>
        {commentReplies.length > 0 &&
          commentReplies.map((comment: any) => <ReviewItem key={comment.id} review={comment} />)}

        <Stack direction={'row'} spacing={2} sx={{}}>
          <TextField
            size="small"
            sx={{ p: 0, height: 10 }}
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
            onClick={handleAddReply}
          >
            Reply
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Stack spacing={2} direction={'row'} sx={{ mt: 5, px: { xs: 2.5, md: 2 } }}>
      {renderContent}
    </Stack>
  );
}
