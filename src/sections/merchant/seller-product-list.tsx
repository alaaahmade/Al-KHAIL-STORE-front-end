import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';

export default function SellerProductList({ products }: { products: any[] }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Products ({products.length})
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={6} sm={4} md={3} lg={2} xl={2}>
            <Card
              sx={{
                maxWidth: 180,
                minWidth: 140,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
              }}
            >
              <CardMedia
                component="img"
                image={product.productImage}
                alt={product.productName}
                sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover', mb: 1 }}
              />
              <CardContent sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="subtitle1" noWrap gutterBottom>
                  {product.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {product.productQuantity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
