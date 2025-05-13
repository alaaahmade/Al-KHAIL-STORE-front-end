import { Avatar, Box, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

interface ListingCardProps {
  title: string;
  images: string[];
  hours?: number;  // Optional, in case `hours` is not always available
  vendor?: {
    id: string
    fullName: string
    picture: string
  },
  credits: number
  id: string
}

export default function ListingCard({ title, images, hours, vendor, credits, id }: ListingCardProps) {
  const router = useRouter();
  return (
    <Box
      sx={{
        height: '25em',
        flexWrap: 'wrap',
        width: {
          xs: '100%',
          sm: '45%',
          md: '28%',
        },
        p: 0.5,
        m: 0,
        mb: 0.5,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        cursor: 'pointer'
      }}
      onClick={() => router.push(`/dashboard/services/${id}`) }
    >
      <Box 
        sx={{
          width: '100%',
          minHeight: '70%',
          height: '70% !important',
          borderRadius: 2,
          m: 0,
          backgroundSize: 'cover',
          backgroundImage: `url(${images[0]})`
        }} 
      />
      {/* {hours && <Typography sx={{ m: '1em' }}>{hours} - </Typography>} */}
      <Typography sx={{ m: '1em' }}>{title}</Typography>
        <Box
        sx={{ display: 'flex', alignItems: 'center' ,
          justifyContent: 'space-between'
        }}>
        <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: '12px'
        }}
      >
      <Avatar sx={{ml: '1em', width: '1.3em', height: '1.3em' }} src={vendor?.picture || 'https://s3-alpha-sig.figma.com/img/d198/ec7d/fabd67194782f154fd13d96e9dcf139d?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pUtd~AGiWY6RyXpgUZ-5TwXaHnBxTrDyKUXVk08vVZY4ErJdk5Xk50deNGUv5PUMeqUDydLaBi~noEB6acP60hwoU50zpZkaBYA6c2fUy9sKTMlBBai6rtRCrx68-9Y1NY70OuGQDc6r7QpJMBgjaNOoxjQqK2ubiko67uYOUIIMckILCqjGQSKmIUeZ3fpK6j0pA0G2xnKZPxQUkOBiT~99b-S1xhyU9UBDKbdsYFkM46MTJ1au5KHvgHeXr3zAWN8qfbQvH~FuFrz-E6viPvpIZDHZREoCuf6wTsrVeG3y1AGwiZA2laK25-qzKj7MP7x-EvWlhHUzR8IiXFtOug__'}/>
        {vendor?.fullName}

      </Typography>
      <Typography variant='h6' sx={{ m: '1em' }}>{credits} Credits</Typography>
        </Box>
        

    </Box>
  );
}
