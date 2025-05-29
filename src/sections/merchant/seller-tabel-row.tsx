'use client';
import Iconify from 'src/components/iconify';
import { Avatar, IconButton, ListItemText, TableCell, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Label from 'src/components/label';
import { fDate } from '@/utils/format-time';
import { useRouter } from 'next/navigation';

const SellerTableRow = ({ row, openDialog }: { row: any; openDialog: any }) => {
  const [change, setChange] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let formattedChange;

    if (row.revenueLastMonth === 0) {
      if (row.revenueThisMonth === 0) {
        formattedChange = '0.0% this month';
      } else {
        formattedChange = 'New revenue this month'; // or "+∞% this month"
      }
    } else {
      const change = ((row.revenueThisMonth - row.revenueLastMonth) / row.revenueLastMonth) * 100;
      const sign = change > 0 ? '+' : '';
      formattedChange = `${sign}${change.toFixed(1)}% this month`;
      setChange(change);
    }
  }, [row]);
  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.user.firstName} src={row.user.photo} sx={{ mr: 2 }} />
        <ListItemText
          primary={row.user.firstName + ' ' + row.user.lastName}
          primaryTypographyProps={{ typography: 'body2' }}
          secondary={row.user.email}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell>
        <Typography fontWeight={500}>{row.store.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          Since {fDate(row.store.createdAt)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{row.store.products.length} products</Typography>
      </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (row?.user?.status === 'ACTIVE' && 'success') ||
            (row?.user?.status === 'PENDING' && 'warning') ||
            (row?.user?.status === 'BANNED' && 'error') ||
            'default'
          }
          sx={{ p: '0 1em', borderRadius: 50 }}
        >
          {row.user?.status}
        </Label>
      </TableCell>
      <TableCell>
        <Typography fontWeight={700} color="text.primary">
          ${row?.revenueThisMonth?.toLocaleString()}
        </Typography>
        <Typography
          variant="caption"
          color={row?.revenueThisMonth > row?.revenueLastMonth ? 'success.main' : 'error.main'}
        >
          {`${change > 0 ? '+' : ''}${change.toFixed(1)}% this month`}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <IconButton
          size="small"
          sx={{ ml: 1 }}
          onClick={() => openDialog(row)}
          title="View Details"
        >
          <Iconify icon="mdi:eye-outline" width={20} height={20} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default SellerTableRow;
