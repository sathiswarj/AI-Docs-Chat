'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DeleteModal from './components/DeleteModal';

const API_BASE = 'http://localhost:5000';

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

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setPendingFile(selectedFile);
    setInput(selectedFile.name);
    setIsProcessed(false);
  };

  const uploadFile = async (selectedFile) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      const response = await axios.post(`${API_BASE}/chat`, { prompt: userMessage });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
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
      await axios.delete(`${API_BASE}/delete-file`);
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
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden relative">
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
