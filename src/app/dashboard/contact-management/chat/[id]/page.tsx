'use client'
import {useParams, useRouter} from 'next/navigation';
// import {useParams} from 'react-router-dom';
import {useAppSelector} from '@/redux/hooks';
import {useEffect, useState} from 'react';
import { ChatView } from '@/sections/contact-management/chat/view';
import { SplashScreen } from 'src/components/loading-screen';
import axiosInstance from '@/utils/axios';
import Error from 'next/error';
import NotFoundPage from '@/app/not-found';

export default function ChatPage() {
  const {id} = useParams();
  const router = useRouter();
  const {chats} = useAppSelector(state => state.contactManagement);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const getChatDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/v1/chat/room/${id}`) 
      console.log(response);
          
      setCurrentChat(response.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  useEffect(() => {
    if (!id) {
      router.push('/dashboard/contact-management');
    }
  }, [id, router]);

  useEffect(() => {
    getChatDetails();
  }, [id])
  
  if (error) return <NotFoundPage/>

  // return <SplashScreen/>
  return loading ? <SplashScreen/> :currentChat && <ChatView chatId={id} chat={currentChat} />;
}
