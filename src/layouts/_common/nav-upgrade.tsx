// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// hooks
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const dispatch = useDispatch();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack alignItems="center" justifyContent='center'>

        <Stack spacing={0.5} sx={{m:0, mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
          Sign customers in
          </Typography>

          <Typography variant="body2" sx={{m: 0, color: 'text.disabled', opacity: 0.72, width: '90%', fontSize: 12 }}>
          Sign customers in manually if scanner is not working correctly
          </Typography>
        </Stack>

        <Button sx={{
          backgroundColor: 'transparent',
          border: '1px solid #00A9197A',
          color: '#00A9197A',
          borderRadius: 1,
          p: 1,
          width: 200,
          '&:hover': {
            backgroundColor: '#00A9197A',
            color: '#fff',
          }
        }}  variant="contained" onClick={() => {
        }} rel="noopener">
          Enter Code 
        </Button>
      </Stack>
    </Stack>
  );
}
