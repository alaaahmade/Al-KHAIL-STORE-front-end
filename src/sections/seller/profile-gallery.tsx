'use client'
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { ProductCard } from './productCard';
import { useState } from 'react';
import { Pagination } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  products: any[];
};

export default function ProfileProducts({ products }: Props) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;


  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Products
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
      >
         {Array.isArray(products) && paginatedProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          color="primary"
          sx={{

            '& .Mui-selected': {
              backgroundColor: '#D81B60',
              color: '#fff',
            },
          }}
        />
      </Box>
    </>
  );
}
