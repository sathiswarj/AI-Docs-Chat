'use client';

import React, { useState, useRef, useEffect } from 'react';
import fileService from './services/file.service';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DeleteModal from './components/DeleteModal';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import api from './services/api.service';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! Please upload a PDF document so I can help you analyze it.' }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const { user, loading } = useAuth();
  const router = useRouter();

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,112,243,0.3)]"></div>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setPendingFile(selectedFile);
    setInput(selectedFile.name);
    setIsProcessed(false);
  };

  const uploadFile = async (selectedFile) => {
    setIsUploading(true);
    try {
      await fileService.upload(selectedFile);
      setIsProcessed(true);
      setFile(selectedFile);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Document "${selectedFile.name}" processed successfully! You can now ask me anything about it.`
      }]);
      return true;
    } catch (error) {
      console.error('Upload error', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, there was an error processing your document. Please try again.'
      }]);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking || isUploading) return;

    let currentPrompt = input;

    if (pendingFile) {
      const success = await uploadFile(pendingFile);
      if (!success) return;
      setPendingFile(null);
      if (currentPrompt.trim() === pendingFile.name) {
        setInput('');
        return;
      }
      setInput('');
      return;
    }

    const userMessage = currentPrompt;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await api.post('/chat', { prompt: userMessage });
      setMessages(prev => [...prev, { role: 'ai', content: response.response }]);
    } catch (error) {
      console.error('Chat error', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'I encountered an error while thinking. Please check the backend connection.'
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await fileService.delete();
    } catch (error) {
      console.error('Failed to delete file from server', error);
    }
    setFile(null);
    setPendingFile(null);
    setIsProcessed(false);
    setInput('');
    setMessages([{ role: 'ai', content: 'Hello! Please upload a PDF document so I can help you analyze it.' }]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowDeleteModal(false);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar
        file={file}
        pendingFile={pendingFile}
        isProcessed={isProcessed}
        onDelete={() => setShowDeleteModal(true)}
      />

      <ChatWindow
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        isUploading={isUploading}
        isThinking={isThinking}
        isProcessed={isProcessed}
        pendingFile={pendingFile}
        onUploadClick={() => fileInputRef.current.click()}
        messagesEndRef={messagesEndRef}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf"
      />
    </div>
  );
}
