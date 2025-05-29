import { useAuthContext } from '@/auth/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { createReviews } from '@/redux/slices/reviewsSlice';
import { fetchServiceById } from '@/redux/slices/serviceSlice';
import {
  Box,
  Button,
  Rating,
  Stack,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '@/utils/axios';
import Iconify from '@/components/iconify';

export function ReviewForm() {
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; type: string; text?: string }[]
  >([]);
  const [fileCaptions, setFileCaptions] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { productId } = useParams();
  const { user } = useAuthContext();

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
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
        toast.error(`Failed to upload file: ${file.name}`);
      }
    }
    setUploadedFiles((prev) => [...prev, ...uploaded]);
    setFileCaptions((prev) => [...prev, ...captions]);
    setUploading(false);
    // Reset file input value
    e.target.value = '';
  };

  // Handle caption change
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await dispatch(
        createReviews({
          rating,
          content: review,
          productId,
          userId: user?.id,
          files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        })
      );
      dispatch(fetchServiceById(productId));
      setReview('');
      setRating(0);
      setUploadedFiles([]);
      setFileCaptions([]);
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 3, background: '#fff' }}>
      <Typography variant="subtitle2">Write a Review</Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <Typography variant="body2">Rating:</Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
      </Stack>
      <TextField
        multiline
        minRows={3}
        fullWidth
        placeholder="Share your experience with this product..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        sx={{ mt: 2 }}
      />
      {/* File Upload Section */}
      <Box sx={{ mt: 2 }}>
        {/* Uploaded Files Preview */}
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
                <video src={file.url} width={56} height={56} style={{ borderRadius: 4 }} controls />
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
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
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
              color: '#fff',
              border: '1px solid transparent',
              '&:hover': {
                bgcolor: 'transparent',
                borderColor: '#DB2777',
                color: '#DB2777',
              },
            }}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Stack>
        {uploading && <CircularProgress size={20} sx={{ ml: 2, mt: 2 }} />}
      </Box>
    </Box>
  );
}
