import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

export const useChat = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello. I am Dhanwantari. Please describe your symptoms in detail (Location, Sensation, Modalities)."
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prescription, setPrescription] = useState(null);

    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return;

        const userMessage = { role: 'user', content };

        // Optimistically update UI
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const currentHistory = [...messages, userMessage];

            const response = await axios.post(API_URL, {
                history: currentHistory
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const { role, content: assistantContent, prescription: rx } = response.data;
            const assistantMessage = { role, content: assistantContent };

            setMessages((prev) => [...prev, assistantMessage]);
            if (rx) setPrescription(rx);

        } catch (err) {
            console.error("Chat Error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error?.message || "Unable to connect to Dhanwantari. Please ensure the server is running.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [messages]); // Dependency on messages to construct history correctly

    return { messages, loading, error, sendMessage, prescription };
};
