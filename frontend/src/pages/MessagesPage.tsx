import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SecureChat from '../components/SecureChat';
import { motion } from 'framer-motion';
import { FaComments, FaShieldAlt, FaUser } from 'react-icons/fa';

interface Conversation {
    id: string;
    recipientName: string;
    recipientRole: 'creator' | 'brand';
    lastMessage: string;
    timestamp: Date;
    unread: boolean;
}

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [conversations] = useState<Conversation[]>([
        {
            id: '1',
            recipientName: 'Sarah Johnson',
            recipientRole: 'creator',
            lastMessage: 'Thank you for the opportunity!',
            timestamp: new Date(Date.now() - 3600000),
            unread: true
        },
        {
            id: '2',
            recipientName: 'Tech Startup Inc',
            recipientRole: 'brand',
            lastMessage: 'When can you start the campaign?',
            timestamp: new Date(Date.now() - 7200000),
            unread: false
        }
    ]);

    const currentUserRole = 'brand'; // This would come from auth context

    const selected = conversations.find(c => c.id === selectedConversation);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                        <FaComments className="text-green-600" />
                        Secure Messages
                    </h1>
                    <p className="text-gray-600 mt-2 font-medium flex items-center gap-2">
                        <FaShieldAlt className="text-green-600" />
                        All conversations are monitored for your protection
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden"
                            style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                <h3 className="font-bold">Active Conversations</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {conversations.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600 text-sm">No conversations yet</p>
                                    </div>
                                ) : (
                                    conversations.map((conversation) => (
                                        <motion.button
                                            key={conversation.id}
                                            onClick={() => setSelectedConversation(conversation.id)}
                                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedConversation === conversation.id ? 'bg-green-50 border-l-4 border-green-600' : ''
                                                }`}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {conversation.recipientName[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-gray-900 truncate">
                                                            {conversation.recipientName}
                                                        </h4>
                                                        {conversation.unread && (
                                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 capitalize mb-1">
                                                        {conversation.recipientRole}
                                                    </p>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {conversation.lastMessage}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2">
                        {selectedConversation && selected ? (
                            <SecureChat
                                recipientName={selected.recipientName}
                                recipientRole={selected.recipientRole}
                                currentUserRole={currentUserRole}
                            />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-md h-[600px] flex items-center justify-center"
                                style={{
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 10px 24px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full flex items-center justify-center">
                                        <FaComments className="text-4xl text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
