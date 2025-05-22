'use client'
import { Card, Typography, Stack, Box, Button, TextField } from '@mui/material';
import Iconify from '@/components/iconify';
import { useState } from 'react';
import { useAuthContext } from '@/auth/hooks';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function ShopContactSection({userID}: any) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const {user} = useAuthContext()
  const router = useRouter()
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  })
  const handleGetOrCreateShatRoom = async () => {
    try {
      if(!user?.id || !userID) return
      const response = await axiosInstance.post('/v1/chat/rooms', {
         userId1: user?.id,
          userId2: userID
      })
      if(response.statusText === 'OK' && response?.data?.id){
        await axiosInstance.post(`/v1/chat/rooms/${response?.data?.id}/messages`, 
          {
          roomId: response?.data?.id,
          senderId: user?.id,
          content: message,
        }
        )
        router.push(`/shop/messages?search=${response?.data?.id}`)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  const handleContact = async() => {
    try {
      const newErrors = {
        name: '',
        email: '',
        message: ''
      }
      if(!name.trim()){
        newErrors.name = 'Name is required'
      }
      if(!email.trim()){
        newErrors.email = 'Email is required'
      }
      if(!message.trim()){
        newErrors.message = 'Message is required'
      }
      setErrors(newErrors)
      if(newErrors.name || newErrors.email || newErrors.message) return
      await handleGetOrCreateShatRoom()
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <Card sx={{ p: 4, borderRadius: 3, boxShadow: 1, mt: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Contact
      </Typography>
      <Typography mb={3}>
        If you have any questions or inquiries, please fill out the form below or contact our support team directly.
      </Typography>
      <Stack spacing={2} mb={3}>
        <TextField label="Your Name" fullWidth 
        onChange={(e) => setName(e.target.value)}
        value={name}
        error={!!errors.name}
        helperText={errors.name}
        />
        <TextField label="Your Email" fullWidth 
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        error={!!errors.email}
        helperText={errors.email}
        />
        <TextField label="Message" fullWidth multiline rows={4} 
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          error={!!errors.message}
          helperText={errors.message}
          />
        <Button
          onClick={handleContact}
          sx={{color: '#fff'}}
        variant="contained" color="primary" startIcon={<Iconify icon="mdi:send-outline" />}>Send Message</Button>
      </Stack>
      <Box sx={{ bgcolor: '#F3F4F6', borderRadius: 2, p: 2, mt: 2 }}>
        <Typography fontWeight={600} mb={1}>Customer Support</Typography>
        <Typography variant="body2" mb={2}>
          Email: support@beautyhaven.com<br />
          Phone: +1 (800) 123-4567
        </Typography>
        <Button variant="outlined" color="primary" startIcon={<Iconify icon="mdi:headset" />}>
          Contact Support
        </Button>
      </Box>
    </Card>
  );
}
