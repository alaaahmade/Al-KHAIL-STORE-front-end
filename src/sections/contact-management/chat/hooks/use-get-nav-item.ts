// types

// ----------------------------------------------------------------------

interface IChatConversation {
  id: string;
  messages: any[];
  participants: any[];
}

type Props = {
  currentUserId: string;
  conversation: IChatConversation;
};

export default function useGetNavItem({ currentUserId, conversation }: Props) {
  const { messages, participants } = conversation;

  const participantsInConversation = participants?.filter(
    (participant: any) => participant.id !== currentUserId
  );

  const lastMessage = messages[0];

  const group = participantsInConversation.length > 1;

  const displayName = participantsInConversation
    .map((participant: any) => participant.firstName + ' ' + participant.lastName)
    .join(', ');

  const hasOnlineInGroup = group
    ? participantsInConversation.map((item: any) => item.isActive)
    : false;

  let displayText = '';

  if (lastMessage) {
    const sender = String(lastMessage?.sender?.id) === String(currentUserId) ? 'You: ' : '';

    const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.content;

    displayText = `${sender}${message}`;
  }

  return {
    group,
    displayName,
    displayText,
    participants: participantsInConversation,
    lastActivity: lastMessage.createdAt,
    hasOnlineInGroup,
  };
}
