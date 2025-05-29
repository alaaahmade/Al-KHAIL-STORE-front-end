'use client';
import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Stack, ListItemText, Rating } from '@mui/material';
import Iconify from '@/components/iconify';

const testimonials = [
  {
    name: 'Sarah Johnson',
    text: 'Amazing selection of products! The quality is outstanding and shipping was fast. Will definitely shop here again!',
    avatar: 'https://static-cse.canva.com/blob/2008403/1600w-vkBvE1d_xYA.jpg',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    text: 'As a seller, this platform has helped me grow my business significantly. The tools and support are excellent!',
    avatar: 'https://static-cse.canva.com/blob/2008403/1600w-vkBvE1d_xYA.jpg',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    text: 'Found my favorite skincare products here! The reviews and ratings helped me make informed decisions.',
    avatar: 'https://static-cse.canva.com/blob/2008403/1600w-vkBvE1d_xYA.jpg',
    rating: 5,
  },
];

const ShopTestimonialsSection = () => (
  <Box sx={{ py: 6, background: '#fff' }}>
    <Typography variant="h5" fontWeight={600} align="center" mb={4}>
      What Our Community Says
    </Typography>
    <Stack direction={'row'} spacing={3} justifyContent="center">
      {testimonials.map((t) => (
        <Grid item xs={12} md={3.5} key={t.name} sx={{ background: '#FFF6FB' }}>
          <Stack
            direction={'column'}
            alignItems={'flex-start'}
            gap={2}
            justifyContent={'center'}
            sx={{ p: 3, borderRadius: 3, textAlign: 'left' }}
          >
            <Stack direction="row" spacing={1} alignItems={'center'} justifyContent={'center'}>
              <Avatar src={t.avatar} alt={t.name} sx={{ width: 40, height: 40, mx: 'auto' }} />
              <ListItemText
                primary={t.name}
                secondary={
                  <Rating
                    emptyIcon={<Iconify color={'#FAAF00'} icon="tdesign:star" />}
                    size="small"
                    value={5}
                    precision={0.1}
                    readOnly
                    icon={<Iconify icon="tdesign:star-filled" />}
                  />
                }
                primaryTypographyProps={{
                  noWrap: true,
                  typography: 'subtitle2',
                }}
                sx={{
                  textAlign: 'left',
                }}
              />
            </Stack>
            <Typography sx={{ lineHeight: 2 }} variant="body2" color="text.secondary" mb={2}>
              {t.text}
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Stack>
  </Box>
);

export default ShopTestimonialsSection;
