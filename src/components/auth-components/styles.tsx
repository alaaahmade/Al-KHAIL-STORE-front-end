import styled from '@emotion/styled';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';

export const StyledAuthWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'background.default',
  width: '100%',
  '@media (min-width: 1024px)': {
    width: '420px',
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  m: 0,
  p: 0,
  borderRadius: 16,
}));

export const SubmitButton = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
