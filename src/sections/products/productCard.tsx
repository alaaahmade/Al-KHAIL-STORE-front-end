import Label from 'src/components/label';
import { fCurrency } from '@/utils/format-number';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import axiosInstance from '@/utils/axios';
import { enqueueSnackbar } from 'notistack';
import { useAuthContext } from '@/auth/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { fetchServices } from '@/redux/slices/serviceSlice';
import { toast } from 'react-toastify';

interface ProductCardProps {
  productName: string;
  productImage: string[];
  hours?: number;  // Optional, in case `hours` is not always available
  store?: {
    id: string
    name: string
    logo: string
  },
  offerPrice: number
  standardPrice: number
  id: string
  productQuantity: string
  category: any[]
  comments: any[]
}

export function ProductCard({product}: {product: ProductCardProps}) {
  const router = useRouter();
  const { id, productName, productImage, standardPrice, productQuantity, category, comments } = product
  const totalRating = comments.reduce((sum, review) => sum + review.rating, 0);
  const numberOfReviews = comments.length;
  const averageRating = totalRating > 0 ?  (totalRating / numberOfReviews).toFixed(1) : 0;  
  const {user} = useAuthContext()
  const dispatch = useAppDispatch()

  const handleDelete = async() => {
    try {
      const response =  await axiosInstance.delete(`/v1/products/${id}`);
      dispatch(fetchServices(user.seller.store.id))
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar('somthing went wrong', { variant: 'error' });
    }
  }


  return (
    <Box
      sx={{
        height: '20em',
        flexWrap: 'wrap',
        width: {
          xs: '100%',
          sm: '45%',
          md: '32%',
        },
        pb: '1em',
        
        m: 0,
        mb: 0.5,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        position: 'relative'
      }}
    >
      <Label
        variant="filled"
        color={
          (+productQuantity > 20  && 'rgba(209, 250, 229, 1)') || 'rgba(254, 226, 226, 1)' ||
          'default'
        }
        sx={{p: '0 1em', borderRadius: 50, right: 15, top: 15, position: 'absolute', zIndex: 2}}
      >
        {+productQuantity > 20 ? "In Stock" : "Low Stock"}
      </Label>
      <Box 
        sx={{
          width: '100%',
          minHeight: '55%',
          height: '55% !important',
          borderRadius: 'inherit',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          m: 0,
          backgroundSize: 'cover',
          backgroundImage: `url(${productImage})`,
        }} 
      />
      <Typography sx={{ m: '1em' }}>{productName}</Typography>
      <Box
        sx={{ display: 'flex', alignItems: 'center' ,
          justifyContent: 'space-between',
          p: '0 1em'
        }}>
          <Typography variant='caption'>
              {category[0]?.categoryName}
          </Typography>
          <Typography sx={{fontWeight: 'bold', }}
              variant='body2'>
              {fCurrency(standardPrice)}
          </Typography>
        </Box>
        <Box
        sx={{ display: 'flex', alignItems: 'center' ,
          p: '0 1em',
          justifyContent: 'space-between',
          mt: '0.5em',
          mb: '0.5em'
        }}>

        <Typography  fontSize={12}>
        {`⭐ ${averageRating} (${numberOfReviews} reviews)`}
        </Typography>
      <Typography variant="caption" fontSize={12}>{productQuantity} in Stock</Typography>
        </Box>
        <Box
        sx={{ display: 'flex', alignItems: 'center' ,
          justifyContent: 'space-between',
          p: '0 1em',
          
        }}>
          <Button
            size="small"
            sx={{bgcolor: 'rgba(243, 244, 246, 1)', width: '48%', borderRadius: 1}}
            onClick={() => router.push(paths.dashboard.products.edit(id)) }
          >
            Edit
          </Button>
          <Button
            sx={{bgcolor: 'rgba(243, 244, 246, 1)', width: '48%', borderRadius: 1}}
            size="small"
            onClick={handleDelete}
          >
            delete
          </Button>

        </Box>

    </Box>
  );
}


