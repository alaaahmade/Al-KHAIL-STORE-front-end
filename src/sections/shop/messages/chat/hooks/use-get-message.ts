// types

// ----------------------------------------------------------------------

type Props = {
  message: any;
  currentUserId: string;
  participants: any[];
};

export default function useGetMessage({ message, participants, currentUserId }: Props) {
  const sender = participants.find((participant) => participant.id === message.sender.id);

  const isSeller = Array.isArray(sender?.roles) && sender.roles.some((role: any) =>
  (typeof role === 'string' ? role.toUpperCase() : role.name?.toUpperCase()) === 'SELLER'
);

const senderDetails =
  String(message.sender.id) === String(currentUserId)
    ? {
        type: 'me',
      }
    : {
        avatarUrl: isSeller ? sender.seller.store.logo : sender?.photo,
        firstName: isSeller
          ? sender.seller.store.name.split(' ')[0]
          : sender?.firstName,
      };


  const me = senderDetails.type === 'me';

  const hasImage = message.files?.type === 'image';

  return {
    hasImage,
    me,
    senderDetails,
    files: message.files,
  };
}
