import Iconify from 'src/components/iconify';
import { fDate, fDateTime } from '@/utils/format-time';
import { Avatar, Box, Button, ListItemText, Rating, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { position } from 'stylis';

export const ReviewItem = ({ review }: { review: any }) => {
  const { rating, content, createdAt, user } = review;
  console.log(review);
  
  function timeAgo(dateString: any) {
    const now = new Date();
    const past = new Date(dateString);
    const secondsAgo = Math.floor((now - past) / 1000);
  
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  
    const intervals = [
      { unit: "year", seconds: 31536000 },
      { unit: "month", seconds: 2592000 },
      { unit: "day", seconds: 86400 },
      { unit: "hour", seconds: 3600 },
      { unit: "minute", seconds: 60 },
      { unit: "second", seconds: 1 },
    ];
  
    for (const { unit, seconds } of intervals) {
      const diff = Math.floor(secondsAgo / seconds);
      if (diff >= 1) {
        return rtf.format(-diff, unit); // Negative for "X ago"
      }
    }
  
    return "just now";
  }
  return (
    <Stack spacing={2} direction={'column'} sx={{ flex: 1,  }} >
          <Stack sx={{
            backgroundColor: rating ? '#fff': 'rgba(229, 231, 235, 0.29)',
            p: 1.5,
            borderRadius:2,
            position: 'relative'
          }} spacing={1} direction="row" flexGrow={1}>
            {!rating && 
            <Typography
              variant="caption"
              component="span"
              display="block"
              sx={{
                position: 'absolute',
                top: 10,
                right: 20
              }}
            >{timeAgo(createdAt)}</Typography>}
      <Avatar
        src={user.photo}
        sx={{
          width: { xs: 38, md: 40 },
          height: { xs: 38, md: 40 },
        }}
      />
    <ListItemText
      primary={<>
      
      <Typography
            noWrap
            variant="caption"
            component="span"
            display="block"
            sx={{mb:1}}
          >
            {`${user.firstName} ${user.lastName}`}
          </Typography>
            {rating && 
              <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap:2
              }}
              >
                <Rating
                  emptyIcon={<Iconify color={'#FAAF00'} icon="tdesign:star"/>}
                  size="small"
                  value={rating}
                  precision={0.1}
                  readOnly
                  icon={<Iconify icon="tdesign:star-filled" />}
                  />
              <Typography
                
                variant="caption"
                component="span"
                display="block"
                >
            {review.product.productName}
          </Typography>
              </Box>
            }
      </>}
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
          {rating && <Typography
            noWrap
            variant="caption"
            component="span"
            color="text.secondary"
          >
            Posted on {fDate(createdAt)}
          </Typography>}
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
  )
}