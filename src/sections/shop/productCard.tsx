'use client';
import Label from 'src/components/label';
import { fCurrency } from '@/utils/format-number';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Iconify from '@/components/iconify';
import axiosInstance from '@/utils/axios';
import { useAuthContext } from '@/auth/hooks';
import { toast } from 'react-toastify';

interface ProductCardProps {
  productName: string;
  description: string;
  productImage: string[];
  hours?: number;
  store?: {
    id: string;
    name: string;
    logo: string;
  };
  offerPrice: number;
  standardPrice: number;
  id: string;
  productQuantity: string;
  category: any[];
  comments: any[];
}

export function ProductCard({ product }: { product: ProductCardProps }) {
  const router = useRouter();
  const { id, productName, productImage, standardPrice, description, category, comments } = product;
  const totalRating = comments.reduce((sum, review) => sum + review.rating, 0);
  const numberOfReviews = comments.length;
  const averageRating = totalRating > 0 ? (totalRating / numberOfReviews).toFixed(1) : 0;
  const { user } = useAuthContext();

  const addToCart = async (productId: string) => {
    try {
      const response = await axiosInstance.post(`/v1/carts/${user?.cart?.id}/items`, {
        productId,
        quantity: 1,
        price: standardPrice,
      });

      console.log(response);
      toast.success('Product added to cart');
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  return (
    <Box
      sx={{
        height: '20em',
        flexWrap: 'wrap',
        pb: '0em',
        m: 0,
        mb: 0,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <Label
        variant="filled"
        color={'transparent'}
        sx={{
          p: '0 1em',
          borderRadius: 50,
          right: 10,
          top: 10,
          position: 'absolute',
          zIndex: 2,
          width: 40,
          height: 40,
        }}
      >
        <Iconify color={'#000'} icon="flowbite:heart-outline" width={40} height={40} />
      </Label>
      <Box
        sx={{
          width: '100%',
          minHeight: '55%',
          height: '55% !important',
          borderRadius: 'inherit',
          m: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundSize: 'cover',
          backgroundImage: `url(${productImage})`,
        }}
        onClick={() => router.push(`/shop/products/${id}`)}
      />
      <Box sx={{ p: '0 1em', m: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'space-between'}
          spacing={0.5}
          mt={1}
        >
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            {' '}
            {category[0]?.categoryName}
          </Typography>
          <Typography color={'#000'} fontSize={12}>
            {`⭐ ${averageRating}`}
          </Typography>
        </Stack>
        <Typography onClick={() => router.push(`/shop/products/${id}`)} mt={1} color="#000">
          {productName}
        </Typography>
        <Box
          sx={{
            mt: '0.5em',
            mb: '0.5em',
          }}
        >
          <Typography
            mt={1}
            variant="caption"
            fontSize={12}
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 200, // adjust width as needed
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: '0',
            mt: 2,
          }}
        >
          <Typography sx={{ fontWeight: 'bold', color: '#000' }} variant="body2">
            {fCurrency(standardPrice)}
          </Typography>
          <Button
            sx={{ bgcolor: 'primary.main', color: '#fff', width: '48%', borderRadius: 50 }}
            size="small"
            onClick={() => addToCart(id)}
          >
            Add to cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
