import Iconify from 'src/components/iconify';
import { fDate } from '@/utils/format-time';
import { Avatar, Button, ListItemText, Rating, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

export const ReviewItem = ({ review }: { review: any }) => {
  const { rating, content, createdAt, user } = review;
  return (
    <Stack spacing={2} direction={'column'} sx={{ flex: 1 }}>
      <Stack spacing={1} direction="row" flexGrow={1}>
        <Avatar
          src={user.photo}
          sx={{
            width: { xs: 38, md: 40 },
            height: { xs: 38, md: 40 },
          }}
        />
        <ListItemText
          primary={`${user.firstName} ${user.lastName}`}
          secondary={
            <>
              <Typography noWrap variant="caption" component="span" display="block">
                {content}
              </Typography>
              <Typography noWrap variant="caption" component="span" color="text.secondary">
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

        {rating && (
          <Rating
            emptyIcon={<Iconify color={'#FAAF00'} icon="tdesign:star" />}
            size="small"
            value={rating}
            precision={0.1}
            readOnly
            icon={<Iconify icon="tdesign:star-filled" />}
          />
        )}
      </Stack>
    </Stack>
  );
};
