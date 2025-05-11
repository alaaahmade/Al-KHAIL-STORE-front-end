'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter, usePathname } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { DatePicker } from '@mui/x-date-pickers'
import { fBerthDate } from 'src/utils/format-time';
import { Icon } from '@iconify/react';
import { StyledAuthWrapper, SubmitButton } from 'src/components/auth-components';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();
  const pathName = usePathname();
  const theme = useTheme()
  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.(data.email, data.password, data.firstName, data.lastName);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
      );
    }
  });



const linkStyle= {
  cursor: 'pointer',
  width: '50%',
  textAlign: 'center',
  p: 1,
display: 'inline-block',
m: 0,
}


  const renderHead = (
    <Box
    sx={{
    mb: 4,
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    }}>
      <Typography
        sx={{
          color: pathName.includes('login') ? 'primary.main' : 'text.primary',
          borderBottom: pathName.includes('login') ? `2px solid ${theme.palette.primary.main}` : 'none',
          ...linkStyle
        }}
        onClick={() => {
          router.push(paths.auth.jwt.login);
        }}
      >Login</Typography>

      <Typography
      sx={{
        color: pathName.includes('register') ? 'primary.main' : 'text.primary',
        borderBottom: pathName.includes('register') ? `2px solid ${theme.palette.primary.main}` : 'none',
        ...linkStyle
      }}
      onClick={() => {
        router.push(paths.auth.jwt.register);
      }}
      >Sign Up</Typography>

    </Box>
  );


  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row', }} alignItems='center' spacing={2}>

        <FormControl fullWidth
            sx={{width: '50%'}}

        >
          <InputLabel id="demo-simple-select-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            name='gender'
            label="Gender"
            // onChange={handleChange}
            onChange={(event) => setValue('gender', String(event.target.value))}
          >
            <MenuItem value='Male'> Male</MenuItem>
            <MenuItem value='Female'>Female</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          label="Date of Birth"
          name="dateOfBirth"
          maxDate={new Date('2007-01-01')}
          onChange={(newValue) => setValue('dateOfBirth', fBerthDate(newValue))}
      sx={{
        width: '50%'
      }}
/>
        </Stack>
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <SubmitButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account


          <InputAdornment position="end">
            <IconButton onClick={password.onToggle} edge="end">
              <Icon icon="eva:arrow-ios-forward-fill" width="24" height="24" color='#fff' />
            </IconButton>
          </InputAdornment>
        </SubmitButton>

      </Stack>
    </FormProvider>
  );

    const renderWelcome = (
      <Stack
      alignItems={'center'}
      justifyContent={'center'}
      spacing={2}
      sx={{
      borderTopLeftRadius: 'inherit',
      borderBottomLeftRadius: 'inherit',
      width: '50%',
      height: '100%',
      backgroundImage: `
      linear-gradient(to top right, rgba(236, 72, 153, 0.8),  rgba(139, 92, 246, 0.8)),
      url('/assets/background/authForm.png')
    `,    backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#FFFFFF',
      }}>
        <Typography variant="h5">Welcome to AL KHAIL</Typography>
        <Typography sx={{
          maxWidth: '50%',
          textAlign: 'center',
        }} variant="body2">A store specializing in selling hair and skin care supplies</Typography>
      </Stack>
    );

  return (
    <Stack
      sx={{ height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 4,
      position: 'relative',

    }}
    
    >
    <StyledAuthWrapper
      sx={{
        width: '60% !important',
        height: '80% !important',
        maxHeight: '600px',

        boxShadow: '0px 10px 15px 0px rgba(0, 0, 0, 0.1), 0px 4px 6px 0px rgba(0, 0, 0, 0.1) ',

      }}
    >
    {renderWelcome}
      <Box
        sx={{
          width:'50%',
          p: '2em !important',
        }}
      >
    <FormProvider
    methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
    </Box>
    </StyledAuthWrapper>
    </Stack>
  );
}
