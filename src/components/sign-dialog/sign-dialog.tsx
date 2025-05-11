import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { changeCode, changeStatus, closeDialog, openStatus } from 'src/redux/slices/customerSignSlice';
import { RootState } from 'src/redux/store';



const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

export default function SignDialog() {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state?.signDialog?.open);
  const code = useSelector((state: RootState) => state?.signDialog?.code);


  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleConfirm = () => {
    dispatch(closeDialog());

    // here we can send code to server
    const statusOfResponse = false;
    dispatch(changeStatus({ status: statusOfResponse ? 'success' : 'failed' }));
    dispatch(openStatus());
  };

  return (

      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Sign customer in manually</DialogTitle>
        <DialogContent
        >
        <TextField
          fullWidth
          type='text'
          value={code}
          onChange={(e) => dispatch(changeCode({ code: e.target.value }))}
          placeholder='Code from customer mobile screen'
        />
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',

          }}
        >
          <Button
            sx={{
              backgroundColor: 'success.main',
              color: '#fff',
              width: '49%',
              border: '1px solid #00A9197A',
              '&:hover': {
                backgroundColor: 'transparent',
                border: '1px solid #00A9197A',
                color: 'success.main',
              }
            }}
          onClick={handleConfirm}>Confirm</Button>
          <Button
          sx={{
            width: '49%',
            border: '1px solid #ccc',
          }}
          onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  );
}
