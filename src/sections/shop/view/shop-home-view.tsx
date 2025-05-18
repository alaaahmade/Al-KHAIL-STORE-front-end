import React from 'react';
import ShopHeroSection from '../shop-hero-section';
import ShopCategorySection from '../shop-category-section';
import ShopFeaturedProductsSection from '../shop-featured-products-section';
import ShopBecomeSellerSection from '../shop-become-seller-section';
import ShopTestimonialsSection from '../shop-testimonials-section';
import { Container } from '@mui/material';

const ShopHomeView = () => {
  return (
    <>
      <Container>
        <ShopHeroSection />
        <ShopCategorySection />
        <ShopFeaturedProductsSection />
      </Container>
        <ShopBecomeSellerSection />
        <Container>
        <ShopTestimonialsSection />
      </Container>
      </>
  );
};

export default ShopHomeView;
