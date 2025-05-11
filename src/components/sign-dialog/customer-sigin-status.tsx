import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {  closeStatus } from 'src/redux/slices/customerSignSlice';
import { Icon } from '@iconify/react';
import { RootState } from 'src/redux/store';

const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

export default function StatusDialog() {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state?.signDialog?.openStatus);
  const status = useSelector((state: RootState) => state?.signDialog?.status);

  const handleClose = () => {
    dispatch(closeStatus());
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
        {/* <DialogTitle>Sign customer in manually</DialogTitle> */}
        <DialogContent
        sx={{
          height: '15em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        >
          {status === 'success' ? (
            <><Icon color='#00A919' icon="carbon:checkmark-filled" width="116.67px" height="116.67px" />
            <Typography variant="h6" sx={{ mt: 2 }}>Customer status updated to attended</Typography></>
          ) : (
            <>
            <Icon color='#FF5630' icon="eva:info-fill" width="116.67px" height="116.67px" />
            <Typography variant="h6" sx={{ mt: 2 }}>Something went wrong - try again</Typography>
            </>
          
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: status === 'success' ? 'flex-end' : 'space-between',

          }}
        >
          {status === 'success' ?
          <Button
          sx={{
            p: 1,
            border: '1px solid #ccc',
          }}
          onClick={handleClose}>close</Button> : <>
          <Button
          sx={{
            width: '49%',
            p: 1,
            border: '1px solid #ccc',
            backgroundColor: '#212B36',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#212B36'
            } 
          }}
          onClick={handleClose}>Enter cade manually</Button><Button
          sx={{
            width: '49%',
            p: 1,
            border: '1px solid #ccc',
          }}
          onClick={handleClose}>close</Button>
          </>}
        </DialogActions>
      </Dialog>
  );
}
