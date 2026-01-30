import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { useLocation } from 'react-router-dom';

interface Conversation {
  _id: string;
  otherUser: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function MessagingPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();

    // Check if there's a userId in query params to start a conversation
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId');
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await api.getConversations();
      // Transform backend response to match frontend interface
      const transformedConversations = (response.conversations || []).map((conv: any) => ({
        _id: conv.userId,
        otherUser: {
          _id: conv.user._id,
          name: conv.user.name,
          email: conv.user.email,
          role: conv.user.role || 'creator'
        },
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          createdAt: conv.lastMessage.createdAt
        } : undefined,
        unreadCount: conv.unreadCount || 0
      }));
      setConversations(transformedConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await api.getMessages(userId);
      // Transform backend response to match frontend interface
      const transformedMessages = (response.messages || []).map((msg: any) => ({
        _id: msg._id,
        sender: msg.senderId._id || msg.senderId,
        recipient: msg.receiverId._id || msg.receiverId,
        content: msg.content,
        read: msg.read,
        createdAt: msg.createdAt
      }));
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      const response = await api.sendMessage({ receiverId: selectedUserId, content: newMessage.trim() });
      // Transform the response message
      const transformedMessage = {
        _id: response.message._id,
        sender: response.message.senderId._id || response.message.senderId,
        recipient: response.message.receiverId._id || response.message.receiverId,
        content: response.message.content,
        read: response.message.read,
        createdAt: response.message.createdAt
      };
      setMessages([...messages, transformedMessage]);
      setNewMessage('');

      // Update conversation list
      await loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const selectedConversation = conversations.find(c => c.otherUser._id === selectedUserId);

  // If user is selected but not in conversations (new conversation), create a placeholder
  const [newConversationUser, setNewConversationUser] = useState<any>(null);

  useEffect(() => {
    if (selectedUserId && !selectedConversation) {
      // This is a new conversation, fetch user info
      loadUserInfo(selectedUserId);
    }
  }, [selectedUserId, selectedConversation]);

  const loadUserInfo = async (userId: string) => {
    try {
      // Try to get creator info
      const response = await api.getCreator(userId);
      if (response.creator) {
        setNewConversationUser({
          _id: response.creator._id,
          name: response.creator.userId?.name || 'User',
          email: response.creator.userId?.email || '',
          role: 'creator'
        });
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  const displayUser = selectedConversation?.otherUser || newConversationUser;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
          style={{ height: 'calc(100vh - 12rem)' }}
        >
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">Messages</h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-white/60">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.otherUser._id}
                      onClick={() => setSelectedUserId(conversation.otherUser._id)}
                      className={`w-full p-4 border-b border-white/10 hover:bg-white/5 transition-colors text-left ${selectedUserId === conversation.otherUser._id ? 'bg-white/10' : ''
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">
                            {conversation.otherUser.name[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-semibold truncate">
                              {conversation.otherUser.name}
                            </h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-white/60">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-white/60 text-sm truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="hidden md:flex md:w-2/3 flex-col">
              {displayUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {displayUser.name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold">
                          {displayUser.name}
                        </h3>
                        <p className="text-white/60 text-sm capitalize">
                          {displayUser.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender === user?.id;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${isOwn
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                : 'bg-white/10 text-white'
                              }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-white/50'
                                }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-white/10">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-white/60">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
