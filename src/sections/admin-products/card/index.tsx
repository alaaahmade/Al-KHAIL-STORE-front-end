'use client';

import { Card, Box, Typography, Stack, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'src/components/image';
import { paths } from 'src/routes/paths';
import { fCurrency } from 'src/utils/format-number';

type Props = {
  id: number;
  title: string;
  images?: string[];
  hours?: number;
  vendor: string;
  credits: string;
};

export default function ListingCard({ id, title, images, hours, vendor, credits }: Props) {
  const router = useRouter();

  return (
    <Card
      sx={{
        width: 280,
        height: 'fit-content',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[10],
        },
      }}
      onClick={() => {}}
    >
      <Box sx={{ position: 'relative' }}>
        <Image
          src={images?.[0] || '/assets/images/placeholder.svg'}
          alt={title}
          ratio="1/1"
          sx={{ borderRadius: 1 }}
        />
      </Box>

      <Stack spacing={0.5} sx={{ p: 2 }}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {vendor}
          </Typography>
          <Typography variant="subtitle1">{fCurrency(Number(credits))}</Typography>
        </Stack>

        {hours && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {hours} hour{hours > 1 ? 's' : ''}
          </Typography>
        )}

        <Button fullWidth size="small" color="inherit" variant="outlined" sx={{ mt: 1 }}>
          View Details
        </Button>
      </Stack>
    </Card>
  );
}
