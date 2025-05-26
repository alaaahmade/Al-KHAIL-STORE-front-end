// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
// types
// theme
import { bgGradient } from 'src/theme/css';
import { Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { fNumber } from '@/utils/format-number';

// ----------------------------------------------------------------------

export default function ProfileCover({ name, avatarUrl, totalFollowers, totalProducts, numberOfReviews,totalReview }: {
  name: string;
  avatarUrl: string;
  totalReview: string;
  totalProducts: string;
  totalFollowers: string;
  numberOfReviews: number;
}
) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: 'linear-gradient(90deg, #F472B6 0%, #8B5CF6 100%)',
        height: .8,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 0 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          src={avatarUrl}
          alt={name}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        />

        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 5 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
            primary={name}
            secondary={<Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={'center'}
            gap={2}
          >
              <Typography 
              fontSize={12}>
              {`⭐ ${totalReview} (${numberOfReviews} reviews)`}
              </Typography>
              <Typography 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
              variant='caption'
              fontSize={12}>
                <Iconify sx={{ml: 1,}} icon="fa6-solid:box" width="20" height="20" />
              {` ${totalProducts} products`}
              </Typography>
              <Typography 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
              variant='caption'
              fontSize={12}>
                <Iconify sx={{ml: 1,}} icon="fa6-solid:box" width="20" height="20" />
              {` ${fNumber(totalFollowers)} Followers`}
              </Typography>
          </Stack>}
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 3,
            ml: -5,
            color: '#000',
            component: 'div',
            typography: 'body2',
            // sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}
