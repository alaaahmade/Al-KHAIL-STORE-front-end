'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { IconButton, InputAdornment } from '@mui/material';
import { Icon } from '@iconify/react';
import { useBoolean } from '@/hooks/use-boolean';
import { StyledAuthWrapper, SubmitButton } from 'src/components/auth-components';

// ----------------------------------------------------------------------

export default function JwtForgotPasswordView() {
  const { forgotPassword } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);
  const send = useBoolean();
  
  const ForgetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword(data.email);
      setSent(true);
      setErrorMsg('');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Something went wrong');
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Forgot your password?</Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Please enter the email address associated with your account and we will email you a link to
        reset your password.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {sent && (
        <Alert severity="success">We have sent a password reset link to your email address.</Alert>
      )}

      <RHFTextField name="email" label="Email address" />

      <SubmitButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
        <InputAdornment position="end">
          <IconButton onClick={send.onToggle} edge="end">
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
          ml: 1,
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
