import { ImageList, ImageListItem, ImageListItemBar, Modal, Box } from '@mui/material';
import { useState } from 'react';

export default function ReviewImages({ files = [] }: { files: any[] }) {
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
          .filter((file) => file.type === 'image')
          .map((file, idx) => (
            <ImageListItem
              key={idx}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleOpen(file.url)}
            >
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box>
          <img
            src={selectedImg || ''}
            alt="Full size"
            style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: 12 }}
          />
        </Box>
      </Modal>
    </>
  );
}
