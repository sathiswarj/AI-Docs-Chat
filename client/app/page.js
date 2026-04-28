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
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
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

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const convs = await chatService.getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch data for active conversation
  useEffect(() => {
    const fetchConversationData = async () => {
      if (activeConversationId) {
        try {
          const history = await chatService.getHistory(activeConversationId);
          setMessages(history.map(m => ({ role: m.role, content: m.content })));
          
          // Check for active document in this conversation
          const docRes = await fileService.getActiveDocument(activeConversationId);
          if (docRes.active) {
            setFile({ name: docRes.filename });
            setExtractedText(docRes.text);
            setIsProcessed(true);
          } else {
            setFile(null);
            setExtractedText("");
            setIsProcessed(false);
          }
        } catch (error) {
          console.error('Failed to fetch conversation history', error);
        }
      } else {
        setMessages([{ role: 'ai', content: 'Hello! I am your AI research assistant. You can chat with me directly or upload a document using the icon on the left to start a focused analysis.' }]);
        setFile(null);
        setExtractedText("");
        setIsProcessed(false);
      }
    };
    fetchConversationData();
  }, [activeConversationId]);

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
  };

  const uploadFile = async (selectedFile) => {
    setIsUploading(true);
    try {
      const response = await fileService.upload(selectedFile, activeConversationId);
      setIsProcessed(true);
      setFile(selectedFile);
      setExtractedText(response.text || "");
      
      if (!activeConversationId && response.conversationId) {
        setActiveConversationId(response.conversationId);
        fetchConversations();
      }

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
      currentPrompt = input;
    }

    const userMessage = currentPrompt;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsThinking(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await chatService.sendMessage(userMessage, activeConversationId);
      
      if (!activeConversationId && response.conversationId) {
        setActiveConversationId(response.conversationId);
        fetchConversations();
      }
      
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

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([{ role: 'ai', content: 'Hello! I am your AI research assistant. You can chat with me directly or upload a document using the icon on the left to start a focused analysis.' }]);
    setInput('');
    setFile(null);
    setIsProcessed(false);
    setPendingFile(null);
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;
    try {
      await chatService.deleteConversation(conversationToDelete);
      if (activeConversationId === conversationToDelete) {
        handleNewChat();
      }
      fetchConversations();
    } catch (error) {
      console.error('Failed to delete conversation', error);
    }
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar
        file={file}
        pendingFile={pendingFile}
        isProcessed={isProcessed}
        onNewChat={handleNewChat}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onDeleteConversation={(id) => {
          setConversationToDelete(id);
          setShowDeleteModal(true);
        }}
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
        onClose={() => {
          setShowDeleteModal(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleDeleteConversation}
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
