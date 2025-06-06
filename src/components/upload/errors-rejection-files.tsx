import { FileRejection } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// utils
import { fData } from 'src/utils/format-number';
//
import { fileData } from '../file-thumbnail';

// ----------------------------------------------------------------------

// RejectionFilesProps should accept a readonly FileRejection[] type
interface RejectionFilesProps {
  fileRejections: readonly FileRejection[];
}

// eslint-disable-next-line react/prop-types
const RejectionFiles: React.FC<RejectionFilesProps> = ({ fileRejections }) => {
  // eslint-disable-next-line react/prop-types
  if (!fileRejections.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
      }}
    >
      {(fileRejections || []).map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                - {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
};

export default RejectionFiles;
