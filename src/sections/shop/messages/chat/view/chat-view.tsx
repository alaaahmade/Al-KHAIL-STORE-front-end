'use client'; 
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
// hooks
import { useSettingsContext } from 'src/components/settings';

//
import ChatNav from '../chat-nav';
import ChatMessageList from '../chat-message-list';
import ChatMessageInput from '../chat-message-input';
import ChatHeaderDetail from '../chat-header-detail';
import ChatHeaderCompose from '../chat-header-compose';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchChatDetails, fetchChats } from '@/redux/slices/ContactSlice';
import { useAuthContext } from '@/auth/hooks';
import {  SplashScreen } from '@/components/loading-screen';
import {  useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import NotFoundPage from '@/app/not-found';
import Iconify from '@/components/iconify';

    // ----------------------------------------------------------------------

export default function ChatView() {
  const { user, socket } = useAuthContext();
  const settings = useSettingsContext();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')
  const {chats, loading, error, currentChat} = useAppSelector(state => state.contactManagement);
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState(currentChat?.messages || []);
  const selectedConversationId = searchParams.get('search') || '';
  const [recipients, setRecipients] = useState<any[]>([]);

  const sortMessages = (msgs: any[]) => {
    return msgs.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };


  

  useEffect(() => {
    if(searchQuery && searchQuery.trim().length > 0){
      dispatch(fetchChatDetails(searchQuery))
    }
  }, [searchQuery, dispatch]);

  const handleAddRecipients = useCallback((selected: any[]) => {
    setRecipients(selected);
  }, []);

  useEffect(() => {
    dispatch(fetchChats(user?.id));
  }, [dispatch, user]);
  
  useEffect(() => {
    if (currentChat?.messages) {
      setMessages(sortMessages(currentChat?.messages));
    }
  }, [currentChat]);


  useEffect(() => {
    if (!socket) return;
  
    const handleMessageResponse = (newMessage: any) => {
      console.log('New message received:', newMessage);
      
      if (String(newMessage.chatRoom.id) === String(currentChat?.id)) {
        setMessages((prevMessages: any) => {
          const exists = prevMessages.some((msg: any) => msg.id === newMessage.id);
          if (exists) return prevMessages;
          const updatedMessages = [...prevMessages, newMessage];
          return sortMessages(updatedMessages);
        });
      }
    };
  
    socket.on('messageResponse', handleMessageResponse);
  
    return () => {
      socket.off('messageResponse', handleMessageResponse);
    };
  }, [socket, currentChat?.id, selectedConversationId]);


  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev: any) => prev.filter((m: any) => m.id !== messageId));
  
    socket?.emit('delete', { id: messageId });
  };


      
if (error) return <NotFoundPage/>;
if (loading) return <SplashScreen/>;


  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      flexShrink={0}
      sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
    >
      {currentChat && selectedConversationId  ? (
        <>{currentChat?.participants && <ChatHeaderDetail participants={currentChat?.participants} />}</>
      ) : (
        currentChat?.messages?.length ?  <ChatHeaderCompose contacts={currentChat?.messages} onAddRecipients={handleAddRecipients} />
        : null
      )}
    </Stack>
  );

  const renderNav = (
    <ChatNav
      contacts={chats}
      conversations={chats}
      loading={loading}
      selectedConversationId={searchQuery || ''}
    />
  );

  const renderMessages = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <ChatMessageList messages={messages} participants={currentChat?.participants} handleDeleteMessage={handleDeleteMessage} />
      
      <Iconify sx={{position: 'absolute',
            transform: 'translate(50%, 50%)',
            bottom: '50%', right: '50%',  zIndex: 111,
            opacity: '0.5'
      }} icon="mynaui:chat-messages-solid" width={200} height={200} />
      <ChatMessageInput
        recipients={recipients}
        onAddRecipients={handleAddRecipients}
        selectedConversationId={currentChat?.id}
        disabled={!recipients.length && !currentChat?.id}
      />
    </Stack>
  );


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 2 },
        }}
      >
        Messages
      </Typography>

      <Stack component={Card} direction="row" sx={{ height: '72vh' }}>
        {renderNav}

        {currentChat ? <Stack
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          { currentChat && renderHead}

          <Stack
            direction="row"
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
              borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          >

            {currentChat && renderMessages}

          </Stack>
        </Stack>: (
          <Stack
            sx={{
              width: 1,
              height: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="mynaui:chat-messages-solid" width={89} height={89} />
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Select a chat to start messaging
            </Typography>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
