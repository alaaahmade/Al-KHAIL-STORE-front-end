// types
import { IChatParticipant, IChatMessage } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  message: IChatMessage;
  currentUserId: string;
  participants: IChatParticipant[];
};

export default function useGetMessage({ message, participants, currentUserId }: Props) {
  const sender = participants.find((participant) => participant.id === message.sender.id);

  const senderDetails =
    String(message.sender.id) === String(currentUserId)
      ? {
          type: 'me',
        }
      : {
          avatarUrl: sender?.photo,
          firstName: sender?.firstName,
        };

  const me = senderDetails.type === 'me';

  const hasImage = message?.files?.type === 'image';

  return {
    hasImage,
    me,
    senderDetails,
    files: message.files,
  };
}
