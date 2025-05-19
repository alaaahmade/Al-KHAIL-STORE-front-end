'use client'
import { Box, Paper, Stack } from '@mui/material';
import { useState } from 'react';

export function ProductImageGallery({ images, mainImage }: { images: string[]; mainImage: string }) {
  const [selected, setSelected] = useState(mainImage);
  return (
    <Box sx={{p: 0, minWidth: '35%'}}>
      <Paper sx={{ p: 0, mb: 2, borderRadius: 2, background: '#fff', width: '100%', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', width: 1, height: 340, mx: 'auto', borderRadius: 2, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={selected} alt="Product" width={340} height={340} style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: '340px' }} />
        </Box>
        <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
          {images.map((img, idx) => (
            <Box
              key={img}
              sx={{ border: selected === img ? '2px solid #E91E63' : '2px solid transparent', borderRadius: 2, cursor: 'pointer' }}
              onClick={() => setSelected(img)}
            >
              <img src={img} alt={`thumb-${idx}`} width={68} height={68} style={{ borderRadius: 8, objectFit: 'cover' }} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
