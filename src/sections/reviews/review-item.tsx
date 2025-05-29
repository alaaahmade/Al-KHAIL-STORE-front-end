import Iconify from 'src/components/iconify';
import { fDate, timeAgo } from '@/utils/format-time';
import { Avatar, Box, ListItemText, Rating, Stack, Typography } from '@mui/material';
import React from 'react';
import ReviewImages from '../shop/view/review-images';

export const ReviewItem = ({ review }: { review: any }) => {
  const { rating, content, createdAt, user } = review;
  return (
    <Stack spacing={2} direction={'column'} sx={{ flex: 1 }}>
      <Stack
        sx={{
          backgroundColor: rating ? '#fff' : 'rgba(229, 231, 235, 0.29)',
          p: 1.5,
          borderRadius: 2,
          position: 'relative',
        }}
        spacing={1}
        direction="row"
        flexGrow={1}
      >
        {!rating && (
          <Typography
            variant="caption"
            component="span"
            display="block"
            sx={{
              position: 'absolute',
              top: 10,
              right: 20,
            }}
          >
            {timeAgo(createdAt)}
          </Typography>
        )}
        <Avatar
          src={user.photo}
          sx={{
            width: { xs: 38, md: 40 },
            height: { xs: 38, md: 40 },
          }}
        />
        <ListItemText
          primary={
            <>
              <Typography noWrap variant="caption" component="span" display="block" sx={{ mb: 1 }}>
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              {rating ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Rating
                    emptyIcon={<Iconify color={'#FAAF00'} icon="tdesign:star" />}
                    size="small"
                    value={rating}
                    precision={0.1}
                    readOnly
                    icon={<Iconify icon="tdesign:star-filled" />}
                  />
                  <Typography variant="caption" component="span" display="block">
                    {review.product.productName}
                  </Typography>
                </Box>
              ) : rating === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Rating
                    emptyIcon={<Iconify color={'#FAAF00'} icon="tdesign:star" />}
                    size="small"
                    value={rating}
                    precision={0.1}
                    readOnly
                    icon={<Iconify icon="tdesign:star-filled" />}
                  />
                  <Typography variant="caption" component="span" display="block">
                    {review.product.productName}
                  </Typography>
                </Box>
              ) : null}
            </>
          }
          secondary={
            <>
              <Typography noWrap variant="caption" component="span" display="block">
                {content}
              </Typography>
              {review.files &&
                Array.isArray(review.files) &&
                review.files.some((f: any) => f.type === 'image') && (
                  <Box sx={{ mt: 1 }}>
                    {/* @ts-ignore */}
                    <ReviewImages files={review.files} />
                  </Box>
                )}
              {rating ? (
                <Typography noWrap variant="caption" component="span" color="text.secondary">
                  Posted on {fDate(createdAt)}
                </Typography>
              ) : null}
              {rating === 0 ? (
                <Typography noWrap variant="caption" component="span" color="text.secondary">
                  Posted on {fDate(createdAt)}
                </Typography>
              ) : null}
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
      </Stack>
    </Stack>
  );
};
