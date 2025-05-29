import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IOrderItem } from 'src/types/order';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IOrderItem;
  selected: boolean;
};

export default function OrderTableRow({ row, selected }: Props) {
  const { orderNumber, user, cart, orderStatus } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {orderNumber.slice(0, 10)}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={user.name} src={user.photo} sx={{ mr: 2 }} />

        <ListItemText
          primary={user.firstName + ' ' + user.lastName}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        {' '}
        {cart.items.length > 1
          ? cart.items[0].product.productName + ' and more items...'
          : cart.items[0].product.productName}{' '}
      </TableCell>
      {/* <TableCell> {cart.items[0].product.productName} </TableCell> */}

      <TableCell> {fCurrency(cart.total)} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (String(orderStatus)?.toLocaleLowerCase() === 'delivered' && 'success') ||
            (String(orderStatus)?.toLocaleLowerCase() === 'processing' && 'warning') ||
            (String(orderStatus)?.toLocaleLowerCase() === 'cancelled' && 'error') ||
            'default'
          }
        >
          {orderStatus}
        </Label>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
