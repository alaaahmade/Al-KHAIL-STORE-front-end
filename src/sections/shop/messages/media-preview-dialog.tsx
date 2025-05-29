import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Stack, TextField } from '@mui/material';
import Iconify from '@/components/iconify';

interface MediaPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  file: { url: string; type: string; text?: string };
  handleChangeCaption: (value: string) => void;
  onSubmit: (value: { text: string; url: string; type: string }) => void;
}

const MediaPreviewDialog: React.FC<MediaPreviewDialogProps> = ({
  open,
  onClose,
  file,
  handleChangeCaption,
  onSubmit,
}) => {
  const { url, type, text } = file;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">Preview</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          p: 2,
        }}
      >
        {type === 'image' ? (
          <img
            src={url}
            alt="media"
            style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, marginBottom: 16 }}
          />
        ) : type === 'video' ? (
          <video
            src={url}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: 400,
              borderRadius: 8,
              marginBottom: 16,
              background: '#000',
            }}
          />
        ) : null}
        <Stack
          direction={'row'}
          spacing={2}
          alignItems="flex-end"
          justifyContent="center"
          sx={{ mt: 2, width: '100%', px: 4 }}
        >
          <TextField
            label="Description"
            size="small"
            fullWidth
            sx={{ mt: 2, wordBreak: 'break-word', textAlign: 'center' }}
            value={text}
            onChange={(e) => handleChangeCaption((e.target as HTMLInputElement).value)}
          />

          <IconButton
            onClick={() => onSubmit({ text, url, type })}
            sx={{
              color: 'primary.main',
              '&:hover': {
                color: 'primary.contrastText',
              },
            }}
          >
            <Iconify icon="ion:send" width="512" height="512" />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
