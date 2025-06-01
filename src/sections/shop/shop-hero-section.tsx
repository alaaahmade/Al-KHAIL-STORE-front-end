'use client'
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import Link from 'next/link';

const images = [
  '/assets/images/home/hero/Skincare.png',
  '/assets/images/home/hero/Home & Kitchen.png',
  '/assets/images/home/hero/Electronics.png',
  '/assets/images/home/hero/Books.png',
  '/assets/images/home/hero/Clothing.png',
  '/assets/images/home/hero/Toys.png',
];
const ShopHeroSection = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => setFade(false), 700);
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => {
          setFade(true);
        }, 300);
      }, 300);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
  }, []);

  <Box
    sx={{
      background: '#fff',
      borderRadius: 2,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      px: { xs: 2, md: 8 },
      py: { xs: 4, md: 2 },
      maxWidth: '1200px',
      mx: 'auto',
      mt: 2,
      mb: 2,
      display: 'flex',
      alignItems: 'center',
      minHeight: { xs: 'auto', md: '420px' },
      flexDirection: { xs: 'column', md: 'row' },
    }}
  >
    <Box flex={1} sx={{ pr: { md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          mb: 2,
          fontFamily: 'inherit',
          fontSize: { xs: '2rem', md: '2.8rem' },
          lineHeight: 1.15,
        }}
      >
        One Store. <br />
        Endless Choices.
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: '#444', mb: 4, fontSize: { xs: '1rem', md: '1.15rem' } }}
      >
        From tech to fashion, home to health — it’s all here. <br />
        Explore a world of products — from everyday essentials to unique finds.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Button
          variant="contained"
          sx={{
            background: '#E90064',
            color: '#fff',
            boxShadow: 'none',
            px: 4,
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': { background: '#c80055' },
          }}
          component={Link}
          href="products"
        >
          Shop Now
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: '#E90064',
            borderColor: '#E90064',
            px: 4,
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1rem',
            background: '#fff',
            '&:hover': {
              borderColor: '#c80055',
              color: '#c80055',
              background: '#fff',
            },
          }}
          component={Link}
          href="shops"
        >
          Discover the Shops
        </Button>
      </Box>
    </Box>
    <Box flex={1} sx={{ mt: { xs: 4, md: 0 }, display: 'flex', justifyContent: 'center' }}>
      <Box
        component="img"
        src={images[imageIndex]}
        alt="Hero Product"
        sx={{
          width: { xs: '100%', md: '440px' },
          height: '100%',
          borderRadius: 2,
          boxShadow: '0 2px 16px rgba(233,0,100,0.08)',
          objectFit: 'cover',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          transition: 'opacity 0.4s',
          opacity: fade ? 1 : 0,
        }}
      />
    </Box>
  </Box>
  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 2,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 2 },
        maxWidth: '1200px',
        mx: 'auto',
        mt: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        minHeight: { xs: 'auto', md: '420px' },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box flex={1} sx={{ pr: { md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontFamily: 'inherit',
            fontSize: { xs: '2rem', md: '2.8rem' },
            lineHeight: 1.15,
          }}
        >
          One Store. <br />
          Endless Choices.
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: '#444', mb: 4, fontSize: { xs: '1rem', md: '1.15rem' } }}
        >
          From tech to fashion, home to health — it’s all here. <br />
          Explore a world of products — from everyday essentials to unique finds.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Button
            variant="contained"
            sx={{
              background: '#E90064',
              color: '#fff',
              boxShadow: 'none',
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': { background: '#c80055' },
            }}
            component={Link}
            href="products"
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: '#E90064',
              borderColor: '#E90064',
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              background: '#fff',
              '&:hover': {
                borderColor: '#c80055',
                color: '#c80055',
                background: '#fff',
              },
            }}
            component={Link}
            href="shops"
          >
            Discover the Shops
          </Button>
        </Box>
      </Box>
      <Box flex={1} sx={{ mt: { xs: 4, md: 0 }, display: 'flex', justifyContent: 'center' }}>
        <Box
          component="img"
          src={images[imageIndex]}
          alt="Hero Product"
          sx={{
            width: { xs: '100%', md: '440px' },
            height: { xs: '200px', md: '320px' },
            borderRadius: 2,
            boxShadow: '0 2px 16px rgba(233,0,100,0.08)',
            objectFit: 'cover',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            transition: 'opacity 0.4s',
            opacity: fade ? 1 : 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default ShopHeroSection;


