// @mui
import Box from '@mui/material/Box';
// types
// components
import Scrollbar from 'src/components/scrollbar';
//
import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { useState } from 'react';
import { Modal } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  messages: any[];
  participants: any[];
  handleDeleteMessage: (id: string) => void;
};

export default function ChatMessageList({ messages = [], participants, handleDeleteMessage }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);
    const [open, setOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
  
      const handleOpen = (url: string) => {
        setSelectedImg(url);
        setOpen(true);
      };
  
  

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: 1 }}>
        <Box>
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              participants={participants}
              onOpenLightbox={(value) => {
                handleOpen(value)
              }}              onDelete={handleDeleteMessage} // 👈 Pass function here

            />
          ))}
        </Box>
          <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
              <img src={selectedImg || ''} alt="Full size" style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: 12 }} />
            </Box>
          </Modal>
      </Scrollbar>
    </>
  );
}
