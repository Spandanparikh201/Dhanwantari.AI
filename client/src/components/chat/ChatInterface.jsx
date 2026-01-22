import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hash, Terminal, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useChat } from '../../hooks/useChat';
import { BiofeedbackAnimation } from '../ui/BiofeedbackAnimation';

export const ChatInterface = () => {
    const { messages, loading, error, sendMessage, prescription } = useChat();
    const [input, setInput] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        sendMessage(input, attachedFile);
        setInput('');
        setAttachedFile(null);
        setFilePreview(null);
    };

    // File handling
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            alert('Only images, PDFs, and text files are allowed');
            return;
        }

        setAttachedFile(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview(null);
        }
    };

    const removeFile = () => {
        setAttachedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Calculate time for header
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-[80vh] flex gap-8 font-body max-w-6xl mx-auto">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative modern-card overflow-hidden">
                {/* Header Bar */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                            <Hash size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main leading-tight">Consultation Session</h2>
                            <p className="text-xs text-text-muted">AI Homeopathy Assistant</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-text-muted bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{time}</div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center py-12 px-4">
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                                    Hello, I'm Dhanwantari
                                </h3>
                                <p className="text-text-muted max-w-md mx-auto">
                                    I'm here to help analyze your symptoms using classical homeopathy patterns. How are you feeling today?
                                </p>
                            </div>
                        )}

                        <AnimatePresence>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 mt-1">
                                            <Terminal size={14} />
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white border border-gray-100 text-text-main rounded-bl-none'
                                        }`}>
                                        <div className="whitespace-pre-wrap leading-relaxed text-sm">
                                            {msg.content}
                                        </div>
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white mt-1">
                                            <Send size={14} />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center gap-3 ml-12">
                                <div className="flex space-x-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-xs text-text-muted">Analyzing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {/* File Preview */}
                    {attachedFile && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {filePreview ? (
                                    <img src={filePreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-text-main">{attachedFile.name}</p>
                                    <p className="text-xs text-text-muted">{(attachedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-text-muted" />
                            </button>
                        </div>
                    )}

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.txt"
                        className="hidden"
                    />

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:ring-2 ring-blue-100 transition-all">
                        {/* Attachment Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-text-muted hover:text-primary"
                            title="Attach file"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        {/* Text Input */}
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your symptoms..."
                            className="flex-1 bg-transparent border-none focus:ring-0 px-2 text-text-main placeholder:text-gray-400 font-body"
                            disabled={loading}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={loading || (!input.trim() && !attachedFile)}
                            className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Pane: Visualizer */}
            <div className="w-1/3 hidden lg:flex flex-col modern-card items-center justify-center bg-gradient-to-br from-white to-blue-50 relative">
                <div className="absolute top-6 left-6">
                    <h3 className="font-bold text-text-main">Bio-Feedback</h3>
                    <p className="text-xs text-text-muted">Live Analysis</p>
                </div>

                <div className="relative z-10">
                    <BiofeedbackAnimation status={loading ? 'active' : 'idle'} />
                </div>

                <div className="absolute bottom-6 w-full px-8">
                    <div className="flex justify-between text-xs text-text-muted border-t border-gray-200 pt-4">
                        <span>System Active</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Connected
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
