import { sub } from 'date-fns';
import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// utils
// api
// components
import Iconify from 'src/components/iconify';
import uuidv4 from '@/utils/uuidv4';
import { createConversation, sendMessage } from '@/app/api/chat';
import { useAuthContext } from '@/auth/hooks';
// types
// ----------------------------------------------------------------------

type Props = {
  recipients: any[];
  onAddRecipients: (recipients: any[]) => void;
  //
  disabled: boolean;
  selectedConversationId: string;
};

export default function ChatMessageInput({
  recipients,
  onAddRecipients,
  disabled,
  selectedConversationId,
}: Props) {
  const router = useRouter();
  
  const { user, socket } = useAuthContext();

  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const myContact = useMemo(
    () => ({
      id: user.id,
      role: user.role,
      email: user.email,
      address: user.address,
      name: user.firstName + ' ' + user.lastName,
      lastActivity: new Date(),
      avatarUrl: user.lastActiveAt,
      phoneNumber: user.phoneNumber,
      status: user.isActive ? 'online' :'online' 
    }),
    [user]
  );

  const messageData = useMemo(
    () => ({
      id: uuidv4(),
      attachments: [],
      body: message,
      contentType: 'text',
      createdAt: sub(new Date(), { minutes: 1 }),
      senderId: myContact.id,
    }),
    [message, myContact.id]
  );

  const conversationData = useMemo(
    () => ({
      id: uuidv4(),
      messages: [messageData],
      participants: [...recipients, myContact],
      type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
      unreadCount: 0,
    }),
    [messageData, myContact, recipients]
  );

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  useEffect(() => {
    if (socket) {
      console.log('Socket in component:', socket);
  
      // Wait until socket is connected
      if (!socket.connected) {
        socket.on('connect', () => {
          console.log('Socket connected in component:', socket.id);
          
          // safe to use socket here
          socket.emit('some-event', { data: 'example' });
        });
      } else {
        // already connected
        console.log('Socket already connected:', socket.id);
        socket.emit('some-event', { data: 'example' });
      }
  
      return () => {
        socket.off('connect');
      };
    }
  }, [socket]);
  
  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter' && message.trim()) {
          if (selectedConversationId) {
            if (!socket) {
              console.warn('No socket available');
              return;
            }
  
            if (!socket.connected) {
              // wait for connect event once
              await new Promise<void>((resolve) => {
                socket.once('connect', () => resolve());
              });
            }
  
            socket.emit('message', {
              romeId: selectedConversationId,
              senderId: myContact.id,
              content: message,
            });
          } else {
            const res = await createConversation(conversationData);
            router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);
            onAddRecipients([]);
          }
          setMessage('');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [message, myContact.id, selectedConversationId, socket, conversationData, router, onAddRecipients]
  );
  

  return (
    <>
      <InputBase
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
