// types
import { IChatConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  currentUserId: string;
  conversation: IChatConversation;
};

export default function useGetNavItem({ currentUserId, conversation }: Props) {
  const { messages, participants } = conversation;
  console.log(conversation);
  
  const participantsInConversation = participants?.filter(
    (participant) => participant.id !== currentUserId
  );

  const lastMessage = messages[0];

  const group = participantsInConversation.length > 1;

  const displayName = participantsInConversation.map((participant) => participant.firstName + ' ' + participant.lastName).join(', ');

  const hasOnlineInGroup = group
    ? participantsInConversation.map((item) => item.isActive)
    : false;

  let displayText = '';
  console.log(lastMessage);
  
  if (lastMessage) {
    const sender = String(lastMessage?.sender?.id) === String(currentUserId) ? 'You: ' : '';

    const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.content;

    displayText = `${sender}${message}`;
  }

  console.log(String(lastMessage?.sender?.id) , String(currentUserId));
  

  return {
    group,
    displayName,  
    displayText,
    participants: participantsInConversation,
    lastActivity: lastMessage.createdAt,
    hasOnlineInGroup,
  };
}
