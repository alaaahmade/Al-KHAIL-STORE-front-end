import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import { IUserItem } from 'src/types/user';
import Iconify from 'src/components/iconify';
import {
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  ListItemText,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import Label from 'src/components/label';
import { timeAgo } from '@/utils/format-time';

type Props = {
  row: IUserItem;
  selected: boolean;
  onSelectRow: (id: string) => void;
  onDeleteRow: (id: number) => void;
  onEditRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleConfirmDelete = () => {
    onDeleteRow(row.id);
    setOpenConfirm(false);
    handleCloseMenu();
  };

  console.log(row, 'row roles');

  return (
    <>
      <TableRow hover selected={selected}>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={row.firstName} src={row.photo} sx={{ mr: 2 }} />

        <ListItemText
          primary={row.firstName + ' ' + row.lastName}
          primaryTypographyProps={{ typography: 'body2' }}
          secondary={row.email}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell>
        {/* <Chip label={row.roles[0].name} color={row.roles[0].name === 'ADMIN' ? 'success' : 'error'} /> */}
        <Label
          variant="soft"
          color={
            (String(row.roles[0].name)?.toLocaleLowerCase() === 'admin' && 'info') ||
            (String(row.roles[0].name)?.toLocaleLowerCase() === 'manager' && 'success') ||
            (String(row.roles[0].name)?.toLocaleLowerCase() === 'seller' && 'warning') ||
            'default'
          }
        > 
          {row.roles[0].name}
        </Label>
      </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1}>
              <Label
              variant="soft"
              color={
                (String(row.roles[0].name) && 'success') ||
                !(String(row.roles[0].name)  && 'error') ||
                'default'
              }
            > 
            
              {row.isActive ? 'Active' : 'Inactive'}
            </Label>
          </Stack>
        </TableCell>

        <TableCell>
          {timeAgo(row.lastActiveAt)}
        </TableCell>

        <TableCell  >
          <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:edit-fill" width={18} height={18}  /> 
          </IconButton>
          <IconButton onClick={handleOpenMenu}>
          <Iconify icon="majesticons:key" width={18} height={18}  /> 
          </IconButton>
          <IconButton onClick={handleOpenMenu}>
          <Iconify icon="nimbus:edit" width={18} height={18}  /> 
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(openMenu)}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleCloseMenu();
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenConfirm(true);
            handleCloseMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user {row.firstName} {row.lastName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
