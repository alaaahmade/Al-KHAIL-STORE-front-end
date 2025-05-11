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
import { Checkbox, Typography } from '@mui/material';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type transactionsItem = {
  id: string;
  name: string;
  avatarUrl: string;
  status: string;
  amount: number;
  date: string;
}

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: transactionsItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, avatarUrl, date, status, id, amount } = row;

  const confirm = useBoolean();


  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        
            <Checkbox checked={selected} onClick={onSelectRow} />
        
        <TableCell padding="checkbox">
        <Typography>#{id}</Typography>
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center', height: '7em' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={name}
            // secondary={name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        
        <TableCell sx={{ height: '7em', whiteSpace: 'wrap'}}>
        <TableCell sx={{ whiteSpace: 'wrap', p: 0, m: 0, border: 0}}>
        <span style={{ display: 'block' }}>{fDate(date, 'dd MMM yyyy')}</span>
        <span style={{ display: 'block', opacity: 0.7 }}>{fDate(date, 'p')}</span>
          </TableCell>
          <TableCell sx={{
            border: 0
          }}/>
          <TableCell sx={{
            border: 0
          }} />
          <TableCell sx={{
            border: 0
          }} />

            
        </TableCell>
        <TableCell
          sx={{
            border: 0
          }}
        >
          <Label
            variant="soft"
            color={
              (status === 'received' && 'success') ||
              (status === 'pending' && 'warning') ||
              (status === 'withdrawal' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{amount}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
