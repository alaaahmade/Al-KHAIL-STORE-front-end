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
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { useSearchParams } from 'next/navigation';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Icon } from '@iconify/react';
import { StyledAuthWrapper, SubmitButton } from 'src/components/auth-components';

// ----------------------------------------------------------------------

export default function JwtResetPasswordView() {
  const { resetPassword } = useAuthContext();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const password = useBoolean();

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!token) {
        throw new Error('Reset token is required');
      }
      await resetPassword(token, data.password);
      setSuccess(true);
      setErrorMsg('');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Something went wrong');
    }
  });

  const renderHead = (
    <Stack spacing={1} sx={{ mb: 5 }}>
      <Typography variant="h4">Reset Password</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Please set your new password
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {success && <Alert severity="success">Password reset successfully!</Alert>}

      <RHFTextField
        name="password"
        label="New Password"
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

      <RHFTextField
        name="confirmPassword"
        label="Confirm New Password"
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
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}

      >
        Reset Password
        <InputAdornment position="end">
          <IconButton onClick={password.onToggle} edge="end">
            <Icon icon="eva:arrow-ios-forward-fill" width="24" height="24" color='#fff' />
          </IconButton>
        </InputAdornment>
      </SubmitButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
          alignSelf: 'flex-end',
        }}
      >
        Return to sign in
      </Link>
    </Stack>
  );

  return (
        <StyledAuthWrapper
        sx={{
          p: 4 
        }}
      >
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
    </StyledAuthWrapper>
  );
}
