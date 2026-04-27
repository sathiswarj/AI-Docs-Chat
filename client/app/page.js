'use client';

import React, { useState, useRef, useEffect } from 'react';
import fileService from './services/file.service';
import chatService from './services/chat.service';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DeleteModal from './components/DeleteModal';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import api from './services/api.service';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! Please upload a document (PDF, Word, or Text) so I can help you analyze it.' }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const abortControllerRef = useRef(null);

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

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch Active Document
          const docRes = await fileService.getActiveDocument();
          if (docRes.active) {
            setFile({ name: docRes.filename });
            setExtractedText(docRes.text);
            setIsProcessed(true);
          }

          // Fetch Chat History
          const history = await chatService.getHistory();
          if (history && history.length > 0) {
            setMessages(history.map(m => ({ role: m.role, content: m.content })));
          }
        } catch (error) {
          console.error('Failed to fetch initial data', error);
        }
      }
    };
    fetchData();
  }, [user]);

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
      const response = await fileService.upload(selectedFile);
      setIsProcessed(true);
      setFile(selectedFile);
      setExtractedText(response.text || "");
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `✨ Document "${selectedFile.name}" is now part of my intelligence nexus! I've analyzed it and split it into several sections for better recall. What would you like to know about it?`
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
    abortControllerRef.current = new AbortController();

    try {
      const response = await api.post('/chat', { prompt: userMessage }, { 
        signal: abortControllerRef.current.signal 
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.response }]);
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessages(prev => [...prev, { role: 'ai', content: 'Generation stopped by user.' }]);
      } else {
        console.error('Chat error', error);
        setMessages(prev => [...prev, {
          role: 'ai',
          content: 'I encountered an error while thinking. Please check the backend connection.'
        }]);
      }
    } finally {
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  const stopThinking = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
    setExtractedText("");
    setShowPreview(false);
    setIsProcessed(false);
    setInput('');
    setMessages([{ role: 'ai', content: 'Hello! Please upload a document (PDF, Word, or Text) so I can help you analyze it.' }]);
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
        extractedText={extractedText}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onStop={stopThinking}
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
        accept=".pdf,.docx,.txt"
      />
    </div>
  );
}
