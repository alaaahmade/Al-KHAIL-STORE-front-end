import Iconify from '@/components/iconify'
import { Avatar, Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import React from 'react'

const ShopCard = ({shop}: {shop: any}) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <Box
        sx={{
          height: 110,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          background: shop.gradient,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          pl: 2,
          pb: 0,
        }}
      >
        <Avatar
          src={shop.avatar}
          sx={{
            width: 48,
            height: 48,
            border: '3px solid #fff',
            boxShadow: 1,
            position: 'absolute',
            bottom: -24,
          }}
        />
      </Box>
      <CardContent sx={{ pt: 4 }}>
        <Typography sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }} color='#000' variant="subtitle1" fontWeight={700} gutterBottom>
          {shop.name}
          <Box component="span" sx={{ ml: 1, color: '#000', fontWeight: 400, fontSize: 14 }}>
            <Iconify color='#FFC107' icon="material-symbols:star-rounded" width="24" height="24" />
            {shop.rating} <span style={{ fontSize: 13 }}>({shop.reviews})</span>
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {shop.description}
        </Typography>
        <Stack direction="row" spacing={2} mb={1}>
          <Typography variant="caption" color="text.secondary">
          <Iconify icon="fa-solid:box" width="512" height="512" />
            <Box component="span" sx={{ fontWeight: 600, ml:1 }}>{shop.products}</Box> Products
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Iconify icon="fontisto:persons" width="26" height="24" />
            <Box component="span" sx={{ fontWeight: 600, ml:1 }}>{shop.followers}</Box> Followers
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {shop.verified && (
            <Chip
              icon={<Iconify color={'#18c964'} icon="lets-icons:check-fill" width="24" height="24" />}
              label="Verified"
              size="small"
              sx={{ bgcolor: '#e7fbe9', color: '#18c964', fontWeight: 600 }}
            />
          )}
          <Box sx={{ flex: 1, mt: 2 }} />
          <Button
            variant="contained"
            color="secondary"
            size="small"
            sx={{ borderRadius: 2, bgcolor: '#f72585', color: '#fff', fontWeight: 600, px: 2, '&:hover': { bgcolor: '#d61e6e' } }}
          >
            Visit Shop
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </Grid>
  )
}

export default ShopCard
