import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaPaperPlane,
  FaPhoneAlt,
  FaVideo,
  FaEllipsisH,
  FaCircle,
  FaImage,
  FaSmile,
  FaPaperclip
} from 'react-icons/fa';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
    type: 'text' | 'image';
}

interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    status: 'online' | 'offline';
}

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [newMessage, setNewMessage] = useState('');
    
    // Mock Data
    const chats: Chat[] = [
        { id: 1, name: "Zara Brand Team", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100", lastMessage: "Can you send the draft by Friday?", time: "10:30 AM", unread: 2, status: 'online' },
        { id: 2, name: "TechReview Pro", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100", lastMessage: "Loved the video! Just one edit...", time: "Yesterday", unread: 0, status: 'offline' },
        { id: 3, name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=1", lastMessage: "Sounds good, thanks!", time: "Mon", unread: 0, status: 'online' },
    ];

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! We loved your proposal regarding the Summer Collection.", sender: 'them', time: '10:00 AM', type: 'text' },
        { id: 2, text: "Ref: Summer Vibes Proposal", sender: 'them', time: '10:01 AM', type: 'text' },
        { id: 3, text: "Thank you! I'm really excited about this potential partnership.", sender: 'me', time: '10:05 AM', type: 'text' },
        { id: 4, text: "Could you clarify the deliverables timeline?", sender: 'me', time: '10:06 AM', type: 'text' },
        { id: 5, text: "Can you send the draft by Friday?", sender: 'them', time: '10:30 AM', type: 'text' },
    ]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        const msg: Message = {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };
        
        setMessages([...messages, msg]);
        setNewMessage('');
        
        // Mock reply
        setTimeout(() => {
             const reply: Message = {
                id: Date.now() + 1,
                text: "Got it, thanks!",
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text'
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    const activeChat = chats.find(c => c.id === selectedChat);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex">
                {/* Sidebar List */}
                <div className="w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-gray-50/30">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                             <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                 <FaEllipsisH />
                             </button>
                        </div>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search chats..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {chats.map(chat => (
                            <button 
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                                    selectedChat === chat.id 
                                    ? 'bg-white shadow-md shadow-gray-100 border border-gray-50' 
                                    : 'hover:bg-white hover:shadow-sm'
                                }`}
                            >
                                <div className="relative">
                                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                                    {chat.status === 'online' && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`font-bold text-sm ${selectedChat === chat.id ? 'text-gray-900' : 'text-gray-700'}`}>{chat.name}</h4>
                                        <span className="text-[10px] text-gray-400 font-bold">{chat.time}</span>
                                    </div>
                                    <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                {activeChat ? (
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <img src={activeChat.avatar} alt="Active" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                                        <FaCircle className="text-[6px]" /> Active Now
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 text-gray-400">
                                <button className="hover:text-primary transition-colors"><FaPhoneAlt /></button>
                                <button className="hover:text-primary transition-colors"><FaVideo /></button>
                                <button className="hover:text-primary transition-colors"><FaEllipsisH /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${
                                        msg.sender === 'me' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                    }`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[10px] block mt-2 opacity-70 ${msg.sender === 'me' ? 'text-white' : 'text-gray-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                                <button type="button" className="text-gray-400 hover:text-gray-600">
                                    <FaPaperclip />
                                </button>
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..." 
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                                    />
                                    <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                        <FaSmile />
                                    </button>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                                >
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
