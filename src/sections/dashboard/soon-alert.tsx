// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CardProps } from '@mui/material/Card';
// theme
import { bgGradient } from 'src/theme/css';
// theme
import { ColorSchema } from 'src/theme/palette';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  color?: ColorSchema;
  items?: any[];
}

export default function SoonAlert({
  title,
  color = 'primary',
  items,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  return (
    <Stack
      alignItems="flex-start"
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        p: 3,
        // py: 3,
        borderRadius: 2,
        textAlign: 'center',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h5" sx={{ color: '#000', mb: 2  }}>
        {title}
      </Typography>
      <Box
        
      >
        {items?.map((item, index) => (
          <Box
            key={item.id || index} // Use a unique identifier or fallback to index
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff5c',
              width: '100%',
              p: 2,
              pb: 0,
              mb: 2, // Optional: Adds some space between the boxes
              boxSizing: 'border-box', // Ensures padding doesn't affect width
              borderRadius: 1, // Optional: Adds rounded corners
              gap :5
            }}
            
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
            <Typography variant="subtitle2" sx={{ color: '#000' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#000', opacity: 0.7, fontSize: 12 }}>
              {item.date}
            </Typography>
            </Box>
              <Button sx={{ color: '#000', backgroundColor: '#FFFFFFA3' }}>Attendance</Button>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
