'sue client';

// @mui
import Stack from '@mui/material/Stack';
// utils
// types
import { IProductReview } from 'src/types/product';
// components
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { ReviewItem } from './review-item';
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';
import { createCommentReply, fetchReviews } from '@/redux/slices/reviewsSlice';
import { useAuthContext } from '@/auth/hooks';
import Iconify from '@/components/iconify';
import { uploadFile } from '@/utils/file';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

// ----------------------------------------------------------------------

type Props = {
  review: IProductReview;
};

export default function ProductReviewItem({ review }: Props) {
  const [replyContent, setReplyContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthContext();
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; type: string; text?: string }[]
  >([]);
  const [fileCaptions, setFileCaptions] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  // Local replies state for optimistic UI
  const [localReplies, setLocalReplies] = useState(review.commentReplies || []);

  const handleAddReply = async () => {
    if (replyContent.trim().length > 0) {
      // Optimistically update replies
      const newReply = {
        id: Date.now(), // temp id
        content: replyContent,
        user: user,
        createdAt: new Date().toISOString(),
        files: uploadedFiles,
        rating: null,
        product: review.product,
      };
      setLocalReplies((prev) => [...prev, newReply]);
      setReplyContent('');
      setUploadedFiles([]);
      setFileCaptions([]);
      // Send to server
      await dispatch(
        createCommentReply({
          content: replyContent,
          commentId: review.id,
          userId: user?.id,
          files: uploadedFiles.map((file) => ({
            url: file.url,
            type: file.type,
            text: file.text,
          })),
        })
      );
    }
    return;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const uploaded: { url: string; type: string; text?: string }[] = [];
    const captions: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { url, type } = await uploadFile(file);
        uploaded.push({ url, type });
        captions.push('');
      } catch (err) {
        toast.error(`Failed to upload file: ${file.name}`);
      }
    }
    setUploadedFiles((prev) => [...prev, ...uploaded]);
    setFileCaptions((prev) => [...prev, ...captions]);
    setUploading(false);
    // Reset file input value
    e.target.value = '';
  };

  const handleCaptionChange = (idx: number, value: string) => {
    setFileCaptions((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setUploadedFiles((prev) => {
      const next = [...prev];
      next[idx].text = value;
      return next;
    });
  };

  // Remove uploaded file
  const handleRemoveFile = async (idx: number) => {
    const fileToDelete = uploadedFiles[idx];
    if (fileToDelete && fileToDelete.url) {
      try {
        // Dynamically import to avoid circular deps
        const { deleteFileFromS3 } = await import('@/utils/file');
        await deleteFileFromS3(fileToDelete.url);
      } catch (err) {
        toast.error('Failed to delete file from server.');
      }
    }
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    setFileCaptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const { commentReplies } = review;
  const renderContent = (
    <Stack spacing={2} direction={'column'} sx={{ flex: 1 }}>
      <ReviewItem review={review} />
      <Stack direction="column" spacing={2} sx={{ p: 3, pt: 1.5 }}>
        {localReplies.length > 0 &&
          localReplies.map((comment: any) => <ReviewItem key={comment.id} review={comment} />)}

        <Box sx={{ mt: 2 }}>
          <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
            {uploadedFiles.map((file, idx) => (
              <Box key={file.url} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  value={fileCaptions[idx] || ''}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleRemoveFile(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>

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
              disabled={uploading}
            >
              <Iconify icon="stash:image-plus-light" width={24} height={24} />
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={handleFileChange}
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
              onClick={handleAddReply}
            >
              Reply
            </Button>
          </Stack>
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
