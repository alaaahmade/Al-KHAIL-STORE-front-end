'use client';
import { useParams, useRouter } from 'next/navigation';
// import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChatView } from '@/sections/contact-management/chat/view';
import { SplashScreen } from 'src/components/loading-screen';
import axiosInstance from '@/utils/axios';
import NotFoundPage from '@/app/not-found';
import { RoleBasedGuard } from '@/auth/guard';

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/contact-management');
    }
  }, [id, router]);
  useEffect(() => {
    const getChatDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/v1/chat/room/${id}`);
        setCurrentChat(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getChatDetails();
  }, [id]);

  if (error) return <NotFoundPage />;

  return <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
    {loading ? <SplashScreen /> : currentChat && <ChatView chatId={id} chat={currentChat} />}
  </RoleBasedGuard>

}
