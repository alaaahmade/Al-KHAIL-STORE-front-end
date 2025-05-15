// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { fToNow } from 'src/utils/format-time';
// types
// components
import Iconify from 'src/components/iconify';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  participants: any[];
};

export default function ChatHeaderDetail({ participants }: Props) {
  const {user} = useAuthContext()
  
    const singleParticipant = participants.filter(p => p.id !== user?.id)[0];
  
  const renderSingle = (
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={singleParticipant.isActive? 'online' : 'offline'}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={singleParticipant.photo} alt={singleParticipant.firstName} />
      </Badge>

      <ListItemText
        primary={singleParticipant.firstName + ' ' + singleParticipant.lastName}
        secondary={
          !singleParticipant.isActive
            ? fToNow(singleParticipant.lastActiveAt)
            : singleParticipant.isActive && 'Online'
        }
        secondaryTypographyProps={{
          component: 'span',
          ...(singleParticipant.isActive && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  return (
    <>
      {renderSingle}

      <Stack flexGrow={1} />

      <IconButton>
        <Iconify icon="solar:phone-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="solar:videocamera-record-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </>
  );
}
