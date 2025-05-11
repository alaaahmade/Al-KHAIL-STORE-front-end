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
import { IconButton, Typography } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { useDispatch, useSelector } from 'react-redux';
import { closeViewRow , openSubF, openRefF, CloseCancelSub, closeSubF, fetchHistory } from '@/redux/slices/subscriptionsSlice';
import { ViewSubscriptionDialog } from 'src/components/custom-dialog/viewSubscriptionDialog';
import { AppDispatch } from '@/redux/store';
import { RefundAmountDialog } from 'src/components/custom-dialog/RefundAmountDialog';


// ----------------------------------------------------------------------

type subscriptionsItem = {
  id: string;
  user: {
    fullName: string;
    email: string;
    profilePicture: string;
    id: string;
  }
  status: string;
  amountJOD: string;
  createdAt: string;
  credits: number;
}

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: subscriptionsItem;
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
  const { user:customer, createdAt, status, id, amountJOD, credits } = row;
  const refund = useSelector((state: any) => state.SubscriptionsSlice.refund);
  const openSub = useSelector((state: any) => state.SubscriptionsSlice.openSub);
  const openRef = useSelector((state: any) => state.SubscriptionsSlice.openRef);
  const cancelSub = useSelector((state: any) => state.SubscriptionsSlice.cancelSub);
  const viewHistory = useSelector((state: any) => state.SubscriptionsSlice.history);
  const dispatch: AppDispatch = useDispatch();  
  const confirm = useBoolean();


  const popover = usePopover();
  // const viewPopover = usePopover();


  const  handleViewRow = async() => {
    await dispatch(fetchHistory(customer.id));
    dispatch(openSubF());
  };
  const handleOpenRef = ()=>{
    dispatch(openRefF())
  }


  const handleCloseCancel = () => {
    dispatch(CloseCancelSub());
  };

  const  handleCancelSub = () => {
    dispatch(CloseCancelSub());
  };


  

  return (
    <>
      <TableRow hover selected={selected}>
      
        <TableCell sx={{ height: '7em', whiteSpace: 'wrap',}}>
        <Typography sx={{ml: 0}}>#{id}</Typography>
        </TableCell>
        

        <TableCell sx={{ display: 'flex', alignItems: 'center', height: '7em' }}>
          <Avatar alt={customer.fullName} src={customer.profilePicture} sx={{ mr: 2 }} />

          <ListItemText
            primary={customer.fullName}
            secondary={customer.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell sx={{ height: '7em', whiteSpace: 'wrap'}}>
        <Label
            variant="soft"
            color={
              (status === 'paid' && 'default') ||
              (status === 'canceled' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
          </TableCell>

        <TableCell sx={{ whiteSpace: 'wrap', p: 0, m: 0, border: 0}}>
          <span style={{ display: 'block' }}>{fDate(createdAt, 'dd MMM yyyy')}</span>
        </TableCell>


        <TableCell sx={{ whiteSpace: 'nowrap' }}>{credits} Credits</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>JOD {amountJOD}</TableCell>
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{price}</TableCell> */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>
      </TableCell>


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
            handleViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          History
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

      <ConfirmDialog
        open={cancelSub}
        onClose={handleCloseCancel}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => {
            dispatch(closeViewRow())
            dispatch(closeSubF())
            handleCancelSub()
          }}>
            Cancel subscription
          </Button>
        }
      />

      {viewHistory && <ViewSubscriptionDialog onClose={closeViewRow} data={viewHistory} openSub={openSub} handleOpenRef={handleOpenRef}/>}
      {refund && <RefundAmountDialog viewHistory={refund} openRef={openRef} />}
    </>
  );
}
