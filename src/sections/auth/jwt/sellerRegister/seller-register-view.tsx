'use client'
import React, { useEffect } from 'react';
import { Box, Card, Typography, Button, TextField, MenuItem, Checkbox, FormControlLabel, Divider, Avatar, Stack } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Logo from '@/components/logo';
import Iconify from '@/components/iconify';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategories } from '@/redux/slices/serviceSlice';
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { useRouter, useSearchParams } from 'next/navigation';
import { PATH_AFTER_LOGIN } from '@/config-global';
import { useAuthContext } from '@/auth/hooks';

export default function SellerRegisterView() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [agree, setAgree] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { categories } = useAppSelector((state: any) => state.serviceSlice);
  const dispatch = useAppDispatch();

  const {createASeller} = useAuthContext()
  
useEffect(() => {
  dispatch(fetchCategories())
}, [dispatch])

const checkUserExist = async () => {
   try {
    setLoading(true)
    const response = await axiosInstance.get(`/users/email/${email}`);
    if (response.data.exists) {
      setStep1Errors({
        ...step1Errors,
        email: 'Email already exists',
      });
      setLoading(false)
    } else {
      setStep(2)
      setLoading(false)
    }
   } catch (error) {
      console.log(error);
      toast.error(error.message)
   }
}

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

const router = useRouter()
const handleCreateSeller = async () => {

  const data = { firstName, lastName, email, password, storeName, description, phoneNumber };

  try {
    setLoading(true);
    const response = await createASeller(data);      
    // console.log(response);
    
    router.push(returnTo || PATH_AFTER_LOGIN);
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.error(error);
    toast.error(
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
    );
  }
}

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="space-between" bgcolor="#fafbfc">
      {/* Top bar */}
      <Box px={3} py={2} borderBottom="1px solid #eee" display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
        <Logo/>
          <Typography variant="h6" color="#e5487e" fontWeight={600} fontFamily="inherit">AL KHAIL STORE</Typography>
        </Box>
        <Typography fontSize={13} color="#888">
          Already have an account?{' '}
          <Button href="/auth/jwt/login" variant="text" size="small" sx={{ color: '#e5487e', minWidth: 0, p: 0, textTransform: 'none' }}>Sign In</Button>
        </Typography>
      </Box>

      {/* Main content */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Card sx={{ display: 'flex', width: 900, minHeight: 500, boxShadow: 3, borderRadius: 3, overflow: 'hidden' }}>
          {/* Left: Form */}
          <Box flex={1} bgcolor="#fff" px={5} py={6} display="flex" flexDirection="column" justifyContent="center">
            {step === 1 && (
              <>
                <Typography variant="h5" fontWeight={500} mb={2} fontFamily="inherit">Become a Seller</Typography>
                  <Stack direction={"row"} spacing={2} mb={0}>
                  <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} fullWidth size="small" error={!!step1Errors.firstName} helperText={step1Errors.firstName} />
                  <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} fullWidth size="small" error={!!step1Errors.lastName} helperText={step1Errors.lastName} />
                  </Stack>
                {/* <Box displ */}
                <TextField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" size="small" error={!!step1Errors.email} helperText={step1Errors.email} />
                <TextField label="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} fullWidth margin="normal" size="small" error={!!step1Errors.phoneNumber} helperText={step1Errors.phoneNumber} />
                <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" size="small" error={!!step1Errors.password} helperText={step1Errors.password} />
                <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth margin="normal" size="small" error={!!step1Errors.confirmPassword} helperText={step1Errors.confirmPassword} />
                <LoadingButton
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, bgcolor: '#e5487e', '&:hover': { bgcolor: '#d13a6c' }, borderRadius: 1, textTransform: 'none' }}
                  onClick={() => {
                    let valid = true;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const phoneRegex = /^\+?[0-9]{7,15}$/;
                    setStep1Errors({});
                    const errors: any = {};
                    if (!firstName) { errors.firstName = 'first name is required'; valid = false; }
                    if (!lastName) { errors.lastName = 'last name is required'; valid = false; }
                    if (!email) { errors.email = 'Email is required'; valid = false; }
                    else if (!emailRegex.test(email)) { errors.email = 'Invalid email address'; valid = false; }
                    if (!phoneNumber) { errors.phoneNumber = 'Phone number is required'; valid = false; }
                    else if (!phoneRegex.test(phoneNumber)) { errors.phoneNumber = 'Invalid phone number'; valid = false; }
                    if (!password) { errors.password = 'Password is required'; valid = false; }
                    else if (password.length < 6) { errors.password = 'Password must be at least 6 characters'; valid = false; }
                    if (confirmPassword !== password) { errors.confirmPassword = 'Passwords do not match'; valid = false; }
                    if (!confirmPassword) { errors.confirmPassword = 'Please confirm your password'; valid = false; }
                    setStep1Errors(errors);
                    if (valid) checkUserExist()
                      // setStep(2);
                  }}
                  loading={loading}
                >
                  Next
                </LoadingButton>
                <Divider sx={{ my: 3 }}>Or continue with</Divider>
                <Box display="flex" gap={2}>
                  <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} sx={{ textTransform: 'none', borderColor: '#eee', color: '#888' }}>Google</Button>
                  <Button variant="outlined" fullWidth startIcon={<FacebookIcon />} sx={{ textTransform: 'none', borderColor: '#eee', color: '#888' }}>Facebook</Button>
                </Box>
              </>
            )}
            {step === 2 && (
              <>
                <Typography variant="h5" fontWeight={500} mb={2} fontFamily="inherit">Become a Seller</Typography>
                <Typography color="text.secondary" fontSize={15} mb={3}>
                  Create your seller account and start growing your beauty business
                </Typography>
                <TextField label="Store Name" value={storeName} onChange={e => setStoreName(e.target.value)} fullWidth margin="normal" variant="outlined" size="small" error={!!step2Errors.storeName} helperText={step2Errors.storeName} />
                <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth margin="normal" variant="outlined" size="small" multiline minRows={3} error={!!step2Errors.description} helperText={step2Errors.description} />
                <TextField
                  select
                  label="Business Category"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  error={!!step2Errors.category}
                  helperText={step2Errors.category}
                >
                  {categories && categories.length > 0 && categories.map((option: {categoryName: string, id: number}) => (
                    <MenuItem key={option.id} value={option.categoryName}>
                      {option.categoryName}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={agree} onChange={e => setAgree(e.target.checked)} />}
                  label={<Typography fontSize={13}>I agree to the <span style={{ color: '#e5487e', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: '#e5487e', cursor: 'pointer' }}>Privacy Policy</span></Typography>}
                  sx={{ alignItems: 'flex-start', mt: 1 }}
                />
                {step2Errors.agree && <Typography color="error" fontSize={12} mt={0.5}>{step2Errors.agree}</Typography>}
                <Box display="flex" gap={2} mt={2}>
                  <Button variant="outlined" fullWidth sx={{ borderColor: '#e5487e', color: '#e5487e', textTransform: 'none' }} onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: '#e5487e', '&:hover': { bgcolor: '#d13a6c' }, borderRadius: 1, textTransform: 'none' }}
                    onClick={() => {
                      let valid = true;
                      setStep2Errors({});
                      const errors: any = {};
                      if (!storeName) { errors.storeName = 'Store name is required'; valid = false; }
                      if (!description) { errors.description = 'Description is required'; valid = false; }
                      if (!category) { errors.category = 'Please select a category'; valid = false; }
                      if (!agree) { errors.agree = 'You must agree to the terms'; valid = false; }
                      setStep2Errors(errors);
                      if (valid) {
                        // TODO: send request here
                        handleCreateSeller()
                      } else {
                        console.log('step2Errors', step2Errors);
                        
                      }
                    }}
                  >
                    Create Seller Account
                  </Button>
                </Box>
              </>
            )}
          </Box>

          {/* Right: Info & Testimonial */}
          <Box flex={1} px={5} py={6} display="flex" flexDirection="column" justifyContent="center" position="relative" sx={{
            background: 'linear-gradient(135deg, #e5487e 0%, #a066e5 100%)',
            color: '#fff',
          }} >
            <Box>
              <Typography variant="h6" fontFamily="inherit" fontWeight={500} mb={2}>Why Sell on AL KHAIL</Typography>
              <Box display="flex" alignItems="flex-start" mb={2}>
                <Box mr={2} mt={0.5}>
                <Iconify icon="fontisto:persons" width={26} height={24} />
                  </Box>
                <Box>
                  <Typography fontWeight={500} fontSize={15}>Access to Customers</Typography>
                  <Typography fontSize={13} color="#f1e3f7">Reach millions of beauty enthusiasts looking for quality products</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="flex-start" mb={2}>
                <Box mr={2} mt={0.5}>
                <Iconify icon="carbon:analytics" width={26} height={24}/>
                  </Box>
                <Box>
                  <Typography fontWeight={500} fontSize={15}>Growth Tools</Typography>
                  <Typography fontSize={13} color="#f1e3f7">Access analytics and marketing tools to grow your business</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="flex-start" mb={3}>
                <Box mr={2} mt={0.5}>
                  <Iconify icon="bxs:shield" width={26} height={24} />
                  </Box>
                <Box>
                  <Typography fontWeight={500} fontSize={15}>Secure Platform</Typography>
                  <Typography fontSize={13} color="#f1e3f7">Safe and reliable platform for your business operations</Typography>
                </Box>
              </Box>
            </Box>
            <Box mt={3} p={2} bgcolor="rgba(255,255,255,0.13)" borderRadius={2} display="flex" alignItems="flex-start">
              <Avatar src="/avatars/avatar_1.jpg" sx={{ width: 44, height: 44, mr: 2 }} />
              <Box>
                <Typography fontWeight={500} fontSize={15} color="#fff">Emma Thompson</Typography>
                <Typography fontSize={13} color="#f1e3f7">Verified Seller</Typography>
                <Typography fontSize={13} color="#fff" mt={1} fontStyle="italic">
                  "Starting my beauty brand on AL KHAIL was the best decision. The support and tools provided helped me scale my business rapidly."
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Footer */}
      <Box py={3} borderTop="1px solid #eee" textAlign="center" fontSize={13} color="#888">
        <Box mb={1}>© {new Date().getFullYear()} AL KHAIL STORE. All rights reserved.</Box>
        <Box>
          <Button href="/privacy-policy" variant="text" size="small" sx={{ color: '#888', minWidth: 0, p: 0, textTransform: 'none' }}>Privacy Policy</Button>
          <span style={{ margin: '0 8px' }}>|</span>
          <Button href="/terms-of-service" variant="text" size="small" sx={{ color: '#888', minWidth: 0, p: 0, textTransform: 'none' }}>Terms of Service</Button>
          <span style={{ margin: '0 8px' }}>|</span>
          <Button href="/contact-support" variant="text" size="small" sx={{ color: '#888', minWidth: 0, p: 0, textTransform: 'none' }}>Contact Support</Button>
        </Box>
      </Box>
    </Box>
  );
}
