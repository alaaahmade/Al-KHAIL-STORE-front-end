import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { ProductInterface } from 'src/types/product';
import { Typography } from '@mui/material';
import { fDate } from '@/utils/format-time';

// ----------------------------------------------------------------------

type Props = {
  row: ProductInterface;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {
  const {
  store,
  productImage,
  productName,
  id,
  category,
  productQuantity,
  productStatus,
  } = row;

  console.log(row);
  

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={productName}
            src={productImage}
            variant="rounded"
            sx={{ mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {productName}
              </Link>
            }
            secondary={
              <Typography>{'#PRD-'+ (+id * 100)}</Typography>
            }
            // secondary={
            //   <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            //     {category}
            //   </Box>
            // }
          />
        </TableCell>
      <TableCell>{category[0].categoryName}</TableCell>
      <TableCell>{fCurrency(row.standardPrice)}</TableCell>
      <TableCell>{Math.floor(+productQuantity)}</TableCell>
      <TableCell>
      <Label
          variant="soft"
          color={
            (+productQuantity <= 50  && 'warning')||
            (String(row.productStatus)?.toLocaleLowerCase() === 'active' && 'success') ||
            (String(row.productStatus)?.toLocaleLowerCase() === 'pending' && 'warning') ||
            (String(row.productStatus)?.toLocaleLowerCase() === 'cancelled' && 'error') ||
            'default'
          }
        >
          {+productQuantity <= 50 ? 'Low Stock' :row.productStatus}
        </Label>
      </TableCell>
      <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify color='#309dec' icon="uil:edit" width={20} height={20} />
        </IconButton>

        <IconButton>
          <Iconify color={'#dc2626'} icon="fa-solid:trash" width={20} height={20} />
        </IconButton>

        </TableCell>
      </TableRow>
    </>
  );
}
