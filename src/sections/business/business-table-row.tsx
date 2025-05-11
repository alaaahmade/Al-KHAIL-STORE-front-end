'use client';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Iconify from 'src/components/iconify';
import Popover from '@mui/material/Popover';
import { Checkbox } from '@mui/material';
import { useState } from 'react';
import { IBusiness } from 'src/types/business';

type Props = {
  row: IBusiness;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
};

export default function BusinessTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const { name, address, contactEmail, contactNumber, type, owner } = row;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'N/A';

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>{name}</TableCell>
      <TableCell>{address}</TableCell>
      <TableCell>{contactEmail}</TableCell>
      <TableCell>{contactNumber}</TableCell>
      <TableCell>{type?.name || 'N/A'}</TableCell>
      <TableCell>{ownerName}</TableCell>

      <TableCell align="right">
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
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
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow();
            handleCloseMenu();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </Popover>
    </TableRow>
  );
}
