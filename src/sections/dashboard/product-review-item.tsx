// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { IProductReview } from 'src/types/product';
// components
import Iconify from 'src/components/iconify';
import { RHFTextField } from '@/components/hook-form';
import { Button, TextField } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  review: IProductReview;
};

export default function ProductReviewItem({ review }: Props) {
  const { rating, content, createdAt, user, attachments, isPurchased } = review;

  const renderInfo = (
      <Avatar
        src={user.photo}
        sx={{
          width: { xs: 38, md: 40 },
          height: { xs: 38, md: 40 },
        }}
      />
  );

  const renderContent = (
    <Stack spacing={2} direction={'column'} sx={{ flex: 1 }}>
          <Stack spacing={1} direction="row" flexGrow={1}>

{isPurchased && (
  <Stack
    direction="row"
    alignItems="center"
    sx={{
      color: 'success.main',
      typography: 'caption',
    }}
  >
    <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
    Verified purchase
  </Stack>
)}

<ListItemText
  primary={`${user.firstName} ${user.lastName}`}
  secondary={
    <>
      <Typography
        noWrap
        variant="caption"
        component="span"
        display="block"
      >
        {content}
      </Typography>
      <Typography
        noWrap
        variant="caption"
        component="span"
        color="text.secondary"
      >
        {fDate(createdAt)}
      </Typography>
    </>
  }
  primaryTypographyProps={{
    noWrap: true,
    typography: 'subtitle2',
    mb: 0.5,
  }}
  sx={{
    textAlign: 'left',
  }}
/>

<Rating
emptyIcon={<Iconify color={'#FAAF00'} icon="tdesign:star"/>}
size="small"
value={rating}
precision={0.1}
readOnly
icon={<Iconify icon="tdesign:star-filled" />}
/>


{!!attachments?.length && (
  <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }}>
    {attachments.map((attachment) => (
      <Box
        component="img"
        key={attachment}
        alt={attachment}
        src={attachment}
        sx={{ width: 64, height: 64, borderRadius: 1.5 }}
      />
    ))}
  </Stack>
)}


</Stack>
<Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
{/* replys */}

<TextField size="small" sx={{p: 0, height: 10}} fullWidth name="reply" placeholder="Write a response..."  />

<Button
  sx={{
    flexShrink: 0,
    bgcolor: 'primary.main',
    color: '#fff',
    '&:hover': {
      bgcolor: 'background.neutral',
      color: 'text.primary',

    },
  }}>
    Reply
  </Button>
</Stack>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={'row'}
      sx={{ mt: 5, px: { xs: 2.5, md: 10} }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
