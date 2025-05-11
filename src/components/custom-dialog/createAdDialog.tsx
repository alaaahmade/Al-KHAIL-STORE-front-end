import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, IconButton, Box, Slide, TextField } from '@mui/material';
import React from 'react';
import { TransitionProps } from 'notistack';
import { useSelector , useDispatch } from 'react-redux';
import { changeNewAd } from '@/redux/slices/AdsSlice';
import { LoadingButton } from '@mui/lab';
import { UploadBox } from '../upload';
import Iconify from '../iconify';

interface CreateAdDialogProps {
  open: boolean;
  onClose: () => void;
  handleSave: () => void;
}


const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

export function CreateAdDialog({ onClose, open, handleSave }: CreateAdDialogProps) { 
  const isHome = useSelector((state: any) => state.AdvertisementsSlice.isHome);
  const error = useSelector((state: any) => state.AdvertisementsSlice.error);
  const newAd = useSelector((state: any) => state.AdvertisementsSlice.newAd);
  const loadingB = useSelector((state: any) => state.AdvertisementsSlice.loadingB);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const dispatch = useDispatch();  
  
  const handleClose = () => {
    dispatch(changeNewAd({ value: '', field: 'image' }))
    dispatch(changeNewAd({ value: '', field: 'link' }))
    dispatch(changeNewAd({ value: '', field: 'title' }))
    onClose()
  };

  const handleFileDrop = async (acceptedFiles: File[]) => {
    console.log({ file: acceptedFiles[0] });
    const file = acceptedFiles[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      dispatch(changeNewAd({ value: file, field: 'image' }));
    }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeNewAd({
      value: e.target.value,
      field: 'title'
    }))
  }


  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeNewAd({
      value: e.target.value,
      field: 'link'
    }))
  }  

  return (
    <Dialog 
    open={open}
    TransitionComponent={Transition}
    fullWidth
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    BackdropProps={{
      sx: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
    }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        {isHome ? 'Create a home screen ad' : 'Create a search results ad' }
      <IconButton onClick={handleClose} sx={{  }}>
        <Iconify icon="eva:close-fill" />
      </IconButton>

      </DialogTitle>
      <DialogContent>
          <Stack spacing={3}>
            <Box>
            <Typography sx={{
            pl:1

            }}>Ad banner</Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#637381',
            pl:1
          }} >Upload an image with 2:1 ratio to make sure it doesn’t get cropped</Typography>
              <UploadBox placeholder='Upload file' sx={{width: 1, height: '10em'}} 
                onDrop={handleFileDrop}
                preview={ typeof newAd.image === 'string' ? newAd.image : previewUrl }
                error={error && error.image}
                helperText={error && error.image}              />

            </Box>

            {!isHome &&
            (
                <TextField
                id="outlined-disabled"
                label="Title"
                value={newAd.title}
                fullWidth
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderStyle: 'dashed', // Set the border style to dashed
                  },
                }}
                onChange={handleChangeTitle}
              />
              )}

              <TextField
                id="outlined"
                label="Ad link"
                value={newAd.link}
                fullWidth
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderStyle: 'dashed', // Set the border style to dashed
                  },
                }}
                onChange={handleChangeUrl}
              />
            
          </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton loading={loadingB} sx={{backgroundColor: '#212B36' , color: '#fff'}} onClick={handleSave}>Publish</LoadingButton>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}