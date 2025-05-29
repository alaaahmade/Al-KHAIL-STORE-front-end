import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// types
// components
import Iconify from 'src/components/iconify';
//
import { useGetMessage } from './hooks';
import { useAuthContext } from '@/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  message: any;
  participants: any[];
  onOpenLightbox: (value: string) => void;
  onDelete: (id: string) => void;
};

export default function ChatMessageItem({ message, participants, onDelete, onOpenLightbox }: Props) {
  const { user } = useAuthContext();
  
  const { me, senderDetails, hasImage, files } = useGetMessage({
    message,
    participants,
    currentUserId: user?.id,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { content, createdAt } = message;


  const confirm = useBoolean();

  const handleDeleteMessage = () => {
    confirm.onTrue();
  };

  const handleConfirmDelete = () => {
    onDelete(message.id);
    confirm.onFalse();
  };

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {!me && `${firstName},`} &nbsp;
      {formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
      })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(me && {
          color: '#fff',
          bgcolor: 'primary.main',
        }),
        ...(hasImage && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      {hasImage ? (
        <Stack sx={{}} direction="column" alignItems={me ? "flex-end" : "flex-start"}>
        <Box
          component="img"
          alt="attachment"
          src={files.url}
          onClick={() => onOpenLightbox(files.url)}
          sx={{
            minHeight: 220,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        />
        <Typography textAlign={me ? 'right' : 'left'} sx={{ mt: 1, bgcolor: 'primary.main', color: '#fff', borderRadius: 1, p: 2, width : 'fit-content' }}>
          {files.text}
        </Typography>
        
        </Stack>
      ) : (
        content
      )}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && {
          left: 'unset',
          right: 0,
        }),
      }}
    >
      <IconButton size="small">
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>
      <IconButton
        onClick={handleDeleteMessage}
        size="small"
      >
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Message"
        content="Are you sure you want to delete this message?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 5 }}>
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems="flex-end">
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}
          {me && renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}
