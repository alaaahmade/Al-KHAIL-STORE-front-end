import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, IconButton, Box, TextField } from '@mui/material';
import React from 'react';
import { TransitionProps } from 'notistack';
import { useSelector , useDispatch } from 'react-redux';
import { changeNewCat, setEditMode } from 'src/redux/slices/CategoriesSlice';
import { LoadingButton } from '@mui/lab';
import { UploadBox } from '../upload';
import Iconify from '../iconify';

interface CreateCatDialogProps {
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

export function CreateCatDialog({ onClose, open, handleSave }: CreateCatDialogProps) { 
  const newCategory = useSelector((state: any) => state.CategoriesSlice.newCategory);
  const ladingB = useSelector((state: any) => state.CategoriesSlice.ladingB);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const dispatch = useDispatch();
  const error = useSelector((state: any) => state.CategoriesSlice.error);
  console.log(newCategory);
  
  const handleClose = () => {
    dispatch(changeNewCat({ value: '', field: 'icon' }))
    dispatch(changeNewCat({ value: '', field: 'name' }))
    dispatch(setEditMode(null))
    onClose()
  };


  const handleFileDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      dispatch(changeNewCat({ value: file, field: 'icon' }));
    }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeNewCat({
      value: e.target.value,
      field: 'name'
    }))
  }


  return (
    <Dialog 
    open={open}
    TransitionComponent={Transition}
    fullWidth
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide"
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
        {newCategory.id ? `Update ${newCategory.name} category` : 'Create a new category' }
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
                preview={ typeof newCategory.icon === 'string' ? newCategory.icon : previewUrl }
                error={error && error.icon}
                helperText={error && error.icon}
              />

            </Box>
                <TextField
                id="outlined-disabled"
                label="Name"
                value={newCategory.name}
                fullWidth
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-notchedOutline': {
                     // Set the border style to dashed
                  },
                }}
                error={error && error.name}
                helperText={error && error.name}
                onChange={handleChangeTitle}
              />
            
          </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton  loading={ladingB} sx={{backgroundColor: '#212B36' , color: '#fff'}} onClick={handleSave}>Publish</LoadingButton>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}