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
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { StyledAuthWrapper, SubmitButton } from 'src/components/auth-components';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
        <Divider>Or continue with</Divider>   
        <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Iconify icon="mdi:google" width={24} height={24} />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Iconify icon="mdi:facebook" width={24} height={24} />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Iconify icon="mdi:twitter" width={24} height={24} />
            </Button>
          </Grid>
        </Grid>
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
