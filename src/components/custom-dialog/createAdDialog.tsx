import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, IconButton, Box, Slide, TextField, MenuItem, Grid } from '@mui/material';
import React, { useState } from 'react';
import { TransitionProps } from 'notistack';
import { useSelector , useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { UploadBox } from '../upload';
import Iconify from '../iconify';
import { Icon } from '@iconify/react';
import { uploadFile } from '@/utils/s3.client';

interface CreateAdDialogProps {
  open: boolean;
  onClose: () => void;
  handleSave: (data: any) => void;
}
const categories = ['Skincare', 'Makeup', 'Hair Care', 'Fragrance'];


const Transition = React.forwardRef((
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

const formSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  storeDescription: Yup.string().required('Store description is required'),
  contactNumber: Yup.string().required('Contact number is required'),
  storeAddress: Yup.string().required('Store address is required'),
  // storeLogo: Yup.string().required('Store logo is required'),
  storeCategory: Yup.string().required('Store category is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),

})

export function CreateAdDialog({ onClose, open, handleSave }: CreateAdDialogProps) { 
  const isHome = useSelector((state: any) => state.SellersSlice.isHome);
  const error = useSelector((state: any) => state.SellersSlice.error);
  const newSeller = useSelector((state: any) => state.SellersSlice.newSeller);
  const loadingB = useSelector((state: any) => state.SellersSlice.loadingB);

  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    storeDescription: '',
    contactNumber: '',
    storeAddress: '',
    storeLogo: '',
    storeCategory: '',
    password: '',
    confirmPassword: '',
    logoFile: null as File | null,
    });
  
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleOnSave = async () => {
      try {
        await formSchema.validate(form, { abortEarly: false });
        if(!form.logoFile){
          // await uploadFile(form.logoFile as File, form.logoFile.name, form.logoFile.type);
          setForm({ ...form, storeLogo: 'https://static.vecteezy.com/system/resources/previews/022/257/158/non_2x/store-logo-design-illustration-vector.jpg' });
        }
        await handleSave(form);
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          storeDescription: '',
          contactNumber: '',
          storeAddress: '',
          storeLogo: '',
          storeCategory: '',
          password: '',
          confirmPassword: '',
          logoFile: null as File | null,
          })
      } catch (error: any) {
        console.log(error);
      }
    }
  
      const handleFileDrop = async (acceptedFiles: File[]) => {
        console.log({ file: acceptedFiles[0] });
        const file = acceptedFiles[0];
        if (file) {
          setLogoPreview(URL.createObjectURL(file));
          setForm({ ...form, logoFile: file });

          // dispatch(changeNewInterest({ value: file, field: 'image' }));
        }
      };
    const handleSubmit =async (e: React.FormEvent) => {
      e.preventDefault();
      await handleOnSave();

    };
  

  return (
    <Dialog 
    open={open}
    TransitionComponent={Transition}
    fullWidth
    keepMounted
    onClose={onClose}
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
                Add New Merchant

      <IconButton onClick={onClose} sx={{  }}>
        <Iconify icon="eva:close-fill" />
      </IconButton>

      </DialogTitle>
      <DialogContent>
      <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: .5,
                }}
              >
              <TextField
                label="Store First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                fullWidth
                required
                size='small'
                sx={{m: .5}}
              />
              <TextField
                label="Store Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                fullWidth
                required
                size='small'
                sx={{m: .5}}
              />
              </Box>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Business Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                sx={{m: .5}}
                size='small'
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Store Description"
                name="storeDescription"
                value={form.storeDescription}
                onChange={handleChange}
                fullWidth
                required
                size='small'
                sx={{m: .5}}
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                sx={{m: .5}}
                size='small'
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                size='small'
                sx={{m: .5}}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                size='small'
                sx={{m: .5}}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Store Address"
                name="storeAddress"
                value={form.storeAddress}
                onChange={handleChange}
                fullWidth
                sx={{m: .5}}
                size='small'
                required
              />
            </Grid>
            <Grid item xs={12}>
              <UploadBox placeholder='Upload file' sx={{width: 1, height: '10em'}} 
                onDrop={handleFileDrop}
                preview={ logoPreview }
                error={error && error.image}
                helperText={error && error.image}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Store Category"
                name="storeCategory"
                value={form.storeCategory}
                sx={{m: .5}}
                onChange={handleChange}
                size='small'
                fullWidth
                required
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
      </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleOnSave}
           variant="contained" color="secondary" sx={{ bgcolor: '#d72660', color: '#fff' }}>
            Create Merchant
          </Button>
        </DialogActions>
    </Dialog>
  );
}