'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter, usePathname } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { StyledAuthWrapper, SubmitButton } from 'src/components/auth-components';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const pathName = usePathname();
  const theme = useTheme()

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    // defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);

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
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <RHFTextField name="email" label="Email" />
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
      <FormControlLabel control={<Checkbox   defaultChecked />} label="Remember me" />
        <Typography
          component={RouterLink}
          href={paths.auth.jwt.forgotPassword}
          variant="body2"
          color="inherit"
          // underline="none"
          sx={{ color: theme.palette.primary.main,
            textDecoration: 'none',
           }}
        >
          Forgot password?
        </Typography>
      </Box>
      <SubmitButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Sign In
      </SubmitButton>
    </Stack>
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
