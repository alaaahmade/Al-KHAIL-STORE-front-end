// @mui
import {  useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// theme
// components
import Logo from 'src/components/logo';
import {  Typography } from '@mui/material';

// ----------------------------------------------------------------------


type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};


const navigation = [
  {
    label: 'Privacy Policy',
    path: '/',
  },
  {
    label: 'Terms of Service',
    path: '/',
  },
  {
    label: 'Terms of Service',
    path: '/',
  },
];

export default function AuthClassicLayout({ children, image, title }: Props) {
  const theme = useTheme();

  const renderLogo = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        position: 'absolute',
        m: { xs: 1.5, md: 1.5},
        zIndex: 9,
      }}
    ><Logo
    />
    <Typography
      variant="h5"
      component="h1"
      sx={{
        zIndex: 9,
        color: 'primary.main',
        fontWeight: 400,
        fontSize: '24px',
        LineHeight: '100%',
        LetterSpacing: '0%',
      }}
    >
      Al KHAIL STORE
    </Typography>

    </Box>
  );
  const helpSupport = (
    <Box
      sx={{
        zIndex: 9,
        p: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1,
        borderTop: '1px solid #d8d8d847',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        mb:1
      }}
    >
      ll rights reserved.
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4
        }}
      >

        {navigation.map((link) => (
          <Typography
            key={link.label}
            component="a"
            href={link.path}
            sx={{
              color: 'text.secondary',
              fontSize: 16,
              textDecoration: 'none',
            }}
          >
            {link.label}
          </Typography>
        ))}

      </Box>
      </Box>)

  const renderContent = (
    <Stack
      sx={{
        width: '100%',
        p: 0,
        m: 0,
      }}
    >
      {children}
    </Stack>
  );



  return (
    <Stack
      // direction="column"
      sx={{
        p: 0,
        m: 0,
        boxSizing: "border-box",
      }}
    >
         {renderLogo}
          {renderContent}
          {helpSupport}



    </Stack>
  );
}
