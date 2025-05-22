// @mui
import Box from '@mui/material/Box';
// types
// components
import Scrollbar from 'src/components/scrollbar';
//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';
import Lightbox, { useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

type Props = {
  messages: any[];
  participants: any[];
  handleDeleteMessage: (id: string) => void;
};

export default function ChatMessageList({ messages = [], participants, handleDeleteMessage }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);


  

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={() => lightbox.onOpen(message.body)}
              onDelete={handleDeleteMessage} // 👈 Pass function here

            />
          ))}
        </Box>
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
