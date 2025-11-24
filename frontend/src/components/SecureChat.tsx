import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaBolt, FaTimes, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: { _id: string; name: string; role: 'creator' | 'brand' };
  receiverId: { _id: string; name: string; role: 'creator' | 'brand' };
  senderRole: 'creator' | 'brand';
  content: string;
  createdAt: string;
  read: boolean;
  hasFilteredContent?: boolean;
  warningIssued?: boolean;
}

interface SecureChatProps {
  recipient: {
    _id: string;
    name: string;
    role: 'creator' | 'brand';
  };
  onMinimize: () => void;
  onNewMessage: () => void;
}

const templates: { [key: string]: { title: string; content: string }[] } = {
    creator: [
      { title: 'Follow Up', content: 'Hi, just wanted to follow up on my application for your campaign. Looking forward to hearing from you!' },
      { title: 'Question', content: 'I have a question about the campaign deliverables. Could you please clarify...' },
    ],
    brand: [
      { title: 'Next Steps', content: 'Thanks for your interest! We\'d like to discuss next steps. Are you available for a brief chat this week?' },
      { title: 'Welcome', content: 'Welcome aboard! We are excited to collaborate with you on this campaign.' },
    ],
    admin: [],
};

export default function SecureChat({ recipient, onMinimize, onNewMessage }: SecureChatProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [warning, setWarning] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserRole = currentUser?.role;

  const fetchMessages = async () => {
    if (!recipient) return;
    try {
      const res = await api.getMessages(recipient._id);
      setMessages(res.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds

    return () => clearInterval(interval);
  }, [recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentUser || !recipient) return;

    const messageData = {
      receiverId: recipient._id,
      content: inputValue,
    };

    try {
      const res = await api.sendMessage(messageData);
      setMessages([...messages, res.message]);
      setInputValue('');
      if (res.warning) {
        setWarning(res.warning);
      } else {
        setWarning('');
      }
      onNewMessage();
    } catch (error) {
      console.error('Failed to send message:', error);
      setWarning('Failed to send message. Please try again.');
    }
  };

  const handleUseTemplate = (content: string) => {
    setInputValue(content);
    setShowTemplates(false);
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading Secure Chat...</p>
        </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden"
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Security Banner */}
      <div className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center gap-3 shadow-md">
        <FaShieldAlt className="text-xl flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold">Secured Chat with {recipient.name}</p>
          <p className="text-xs opacity-90">All communication is monitored for your protection.</p>
        </div>
        <button onClick={onMinimize} className="p-2 hover:bg-white/20 rounded-full">
            <FaTimes />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-3xl text-green-600" />
            </div>
            <p className="text-gray-600 font-medium">Start a secure conversation</p>
            <p className="text-sm text-gray-500 mt-1">All messages are encrypted and monitored.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId._id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.senderId._id === currentUser?.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  } ${message.hasFilteredContent ? 'ring-2 ring-red-500' : ''}`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.senderId._id === currentUser?.id ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Warning Banner */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-3 bg-red-50 border-t border-red-200 flex items-center gap-3"
          >
            <FaExclamationTriangle className="text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700 flex-1 font-medium">{warning}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Panel */}
      <AnimatePresence>
        {showTemplates && currentUserRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200 z-10"
          >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FaBolt className="text-green-600" />
                    <h4 className="font-bold text-gray-900">Quick Templates</h4>
                </div>
                <button onClick={() => setShowTemplates(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <FaTimes className="text-gray-500" />
                </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {templates[currentUserRole]?.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleUseTemplate(template.content)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors border border-gray-200 hover:border-green-300"
                >
                  <div className="font-semibold text-sm text-gray-900 mb-1">{template.title}</div>
                  <div className="text-xs text-gray-600 line-clamp-2">{template.content}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-end gap-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-green-50 hover:border-green-500 transition-all flex-shrink-0"
            title="Use Template"
          >
            <FaBolt className="text-gray-600" />
          </button>
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={2}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}
