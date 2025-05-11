import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';

type Props = {
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numSelected: number;
};

export default function UserTableToolbar({ filterName, onFilterName, numSelected }: Props) {
  return (
    <Stack spacing={2} alignItems="center" direction="row" sx={{ px: 2.5, py: 2 }}>
      <TextField
        size="small"
        value={filterName}
        onChange={onFilterName}
        placeholder="Search user..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
