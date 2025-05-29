import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useAuthContext } from '@/auth/hooks';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ChatNavAccount() {
  const { user } = useAuthContext();

  const popover = usePopover();

  const [status, setStatus] = useState<'online' | 'alway' | 'busy' | 'offline'>('online');
  return (
    <Stack direction="row" alignItems="flex-end" spacing={2}>
      <Badge variant={status} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Avatar
          src={user?.photo}
          alt={user?.firstName + ' ' + user?.lastName}
          onClick={popover.onOpen}
          sx={{ cursor: 'pointer', width: 48, height: 48 }}
        />
      </Badge>
      <Typography>{user?.firstName + ' ' + user?.lastName}</Typography>
    </Stack>
  );
}
