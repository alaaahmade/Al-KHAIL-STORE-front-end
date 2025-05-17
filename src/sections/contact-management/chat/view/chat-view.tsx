    'use client';

    import { useEffect, useState, useCallback } from 'react';
    // @mui
    import Card from '@mui/material/Card';
    import Stack from '@mui/material/Stack';
    import Container from '@mui/material/Container';
    import Typography from '@mui/material/Typography';
    // routes
    import { paths } from 'src/routes/paths';
    import { useRouter, useSearchParams } from 'src/routes/hooks';
    // hooks
    import { useMockedUser } from 'src/hooks/use-mocked-user';
    // components
    import { useSettingsContext } from 'src/components/settings';

    //
    import ChatNav from '../chat-nav';
    import ChatRoom from '../chat-room';
    import ChatMessageList from '../chat-message-list';
    import ChatMessageInput from '../chat-message-input';
    import ChatHeaderDetail from '../chat-header-detail';
    import ChatHeaderCompose from '../chat-header-compose';
    import { useGetContacts, useGetConversation, useGetConversations } from '@/app/api/chat';
    import { useAppDispatch, useAppSelector } from '@/redux/hooks';
  import { fetchChats } from '@/redux/slices/ContactSlice';
  import { useAuthContext } from '@/auth/hooks';

    // ----------------------------------------------------------------------

    export default function ChatView({chatId ,chat}: {chatId: string, chat: any}) {
      const router = useRouter();
      const {chats, loading} = useAppSelector(state => state.contactManagement);
      const [messages, setMessages] = useState(chat?.messages || []);
      const dispatch = useAppDispatch();
      const sortMessages = (msgs: any[]) => {
        return msgs.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      };

      const { user, socket } = useAuthContext();
      console.log({user});

      const settings = useSettingsContext();

      const searchParams = useSearchParams();

      const selectedConversationId = searchParams.get('id') || '';

      const [recipients, setRecipients] = useState<any[]>([]);

      const [ contacts, setContacts ] = useState([]);


      const { conversation, conversationError } = useGetConversation(`${selectedConversationId}`);    
      const participants: any[] = conversation
        ? conversation.participants.filter(
            (participant: any) => participant.id !== user?.id
          )
        : [];

      useEffect(() => {
        if (!chat || !chatId ) {        
          router.push(paths?.dashboard?.contactManagement.root);
        }
      }, [chat, chatId]);

      const handleAddRecipients = useCallback((selected: any[]) => {
        setRecipients(selected);
      }, []);

      useEffect(() => {
        dispatch(fetchChats(user?.id));
      }, []);
      
      useEffect(() => {
        if (chat?.messages) {
          setMessages(sortMessages(chat.messages));
        }
      }, [chat]);


      useEffect(() => {
        if (!socket) return;
      
        const handleMessageResponse = (newMessage: any) => {
          console.log('New message received:', newMessage);
          
          if (String(newMessage.chatRoom.id) === String(chat.id)) {
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, newMessage];
              return sortMessages(updatedMessages);
            });
          }
        };
      
        socket.on('messageResponse', handleMessageResponse);
      
        return () => {
          socket.off('messageResponse', handleMessageResponse);
        };
      }, [socket, chat.id]);
    

      const details = !!conversation;

      const handleDeleteMessage = (messageId: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      
        socket?.emit('delete', { id: messageId });
      };

      const renderHead = (
        <Stack
          direction="row"
          alignItems="center"
          flexShrink={0}
          sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
        >
          {chatId ? (
            <>{chat.participants && <ChatHeaderDetail participants={chat.participants} />}</>
          ) : (
            <ChatHeaderCompose contacts={chat.messages} onAddRecipients={handleAddRecipients} />
          )}
        </Stack>
      );

      const renderNav = (
        <ChatNav
          contacts={contacts}
          conversations={contacts}
          loading={loading}
          selectedConversationId={chatId}
        />
      );

      const renderMessages = (
        <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          {/* <ChatMessageList messages={chat?.messages} participants={chat.participants} /> */}
          <ChatMessageList messages={messages} participants={chat.participants} handleDeleteMessage={handleDeleteMessage} />

          <ChatMessageInput
            recipients={recipients}
            onAddRecipients={handleAddRecipients}
            selectedConversationId={chat.id}
            disabled={!recipients.length && !chat.id}
          />
        </Stack>
      );

      return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Typography
            variant="h4"
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            Chat
          </Typography>

          <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
            {renderNav}

            <Stack
              sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              {renderHead}

              <Stack
                direction="row"
                sx={{
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                {renderMessages}

                {details && <ChatRoom conversation={conversation} participants={participants} />}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      );
    }
