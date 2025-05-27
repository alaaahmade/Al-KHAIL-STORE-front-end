'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import RouterLink from 'src/routes/components/router-link';
// @mui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Box } from '@mui/material';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { useSearchParams, useRouter, usePathname } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Icon } from '@iconify/react';
import { StyledAuthWrapper, SubmitButton } from 'src/components/auth-components';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const [loading, setLoading] = useState(false);

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
    phone: Yup.string().required('Phone number is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  console.log(errors);
  
  const onSubmit = handleSubmit(async (data) => {    
    try {
      setLoading(true);
      const response = await register?.(data.email, data.password, data.firstName, data.lastName, data.phone);      
      router.push(returnTo || PATH_AFTER_LOGIN);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
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


  const tabList = [
  {
    label: 'Login',
    path: paths.auth.jwt.login,
    active: pathName.includes(paths.auth.jwt.login),
  },
  {
    label: 'Sign Up',
    path: paths.auth.jwt.register,
    active: pathName.includes(paths.auth.jwt.register),
  },
  {
    label: 'Become a Seller',
    path: paths.auth.jwt.becomeSeller,
    active: pathName.includes(paths.auth.jwt.becomeSeller),
  },
];


// ----------------------------------------------------------------------

const renderHead = (
  <Box
    sx={{
      mb: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: `1px solid ${theme.palette.divider}`,
      gap: 3,
    }}
  >
    {tabList.map((tab) => (
      <Box
        key={tab.label}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography
          component={RouterLink}
          href={tab.path}
          sx={{
            cursor: 'pointer',
            color: tab.active ? 'primary.main' : 'text.primary',
            fontWeight: tab.active ? 700 : 400,
            fontSize: '13px',
            mb: 0.5,
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
        >
          {tab.label}
        </Typography>
        <Box
          sx={{
            height: 3,
            width: '100%',
            maxWidth: 64,
            borderRadius: 2,
            bgcolor: tab.active ? 'primary.main' : 'transparent',
            transition: 'background 0.2s',
          }}
        />
      </Box>
    ))}
  </Box>
);


  const renderForm = (
    <FormProvider methods={methods}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>
        <RHFTextField name="phone" label="Phone Number" />
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
          // type="submit"
          onClick={onSubmit}
          variant="contained"
          loading={loading}
        >
          Create account


          <InputAdornment position="end">
            <IconButton  edge="end">
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
