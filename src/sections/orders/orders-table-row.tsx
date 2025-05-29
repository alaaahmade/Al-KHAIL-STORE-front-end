// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { Checkbox, Icon, IconButton, Typography } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { IOrder } from '@/types/order';
import { fCurrency } from '@/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: IOrder;
  onDeleteRow: (id: string) => void;
};

export default function UserTableRow({ row, selected, onDeleteRow }: Props) {
  const { user, cart, createdAt, orderStatus, id } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{'ORD-' + id}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={user.firstName} src={user.photo} sx={{ mr: 1 }} />
          <ListItemText
            primary={user.firstName + ' ' + user.lastName}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>{fCurrency(String(cart.total))}</TableCell>

        <TableCell>
          <ListItemText
            primary={
              cart?.items.length > 1
                ? cart?.items[0].product.productName + ' ...'
                : cart?.items[0].product.productName
            }
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={'Qty:' + cart?.items.length}
            secondaryTypographyProps={{ typography: 'caption' }}
          />
        </TableCell>

        <TableCell>{fDate(createdAt, 'MMM dd yyyy')}</TableCell>

        <TableCell
          sx={{
            border: 0,
          }}
        >
          <Label
            variant="soft"
            color={
              (orderStatus === 'delivered' && 'success') ||
              (orderStatus === 'processing' && 'warning') ||
              (orderStatus === 'cancelled' && 'error') ||
              'default'
            }
            sx={{ borderRadius: 50, p: '0 1.2em' }}
          >
            {orderStatus}
            <Iconify icon="oui:arrow-down" width={12} sx={{ ml: 2 }} />
          </Label>
        </TableCell>

        <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
          >
            <Iconify color="error.main" icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow(`${id}`);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
