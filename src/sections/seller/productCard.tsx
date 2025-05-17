import Label from 'src/components/label';
import { fCurrency } from '@/utils/format-number';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';

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

  return (
    <Box
      sx={{
        height: '20em',
        flexWrap: 'wrap',
        pb: '1em',
        
        m: 0,
        mb: 0.5,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => router.push(`/dashboard/services/${id}`) }
      
    >
      <Label
        variant="filled"
        color={
          '#fff'
        }
        sx={{p: '0 1em', borderRadius: 50, right: 15, top: 15, position: 'absolute', zIndex: 2, 
          width: 40,
          height: 40,
        }}
      >
        <Iconify icon="flowbite:heart-outline" width={40} height={40} />
        {/* {+productQuantity > 20 ? "In Stock" : "Low Stock"} */}
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
      />
      <Box
      sx={{p:'0 1em'}}
      >
      <Typography variant='body2' sx={{color: 'primary.main', mt: '1em'}}> {category[0]?.categoryName}</Typography>
      <Typography >{productName}</Typography>
        <Box
        sx={{
          mt: '0.5em',
          mb: '0.5em'
        }}>

        <Typography color={'#000'}  fontSize={12}>
        {`⭐ ${averageRating} (${numberOfReviews} reviews)`}
        </Typography>

        </Box>
        <Box
        sx={{ display: 'flex', alignItems: 'center' ,
          justifyContent: 'space-between',
          p: '0 1em',
        }}>
        <Typography sx={{fontWeight: 'bold', color: '#000'}}
              variant='body2'>
              {fCurrency(standardPrice)}
          </Typography>
          <Button
            sx={{bgcolor: 'primary.main', color: '#fff', width: '48%', borderRadius: 1}}
            size="small"
            onClick={() => router.push(`/dashboard/services/${id}`) }
          >
            Show
          </Button>

        </Box>
        </Box>
    </Box>
  );
}


