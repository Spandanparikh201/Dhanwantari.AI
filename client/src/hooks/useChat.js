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
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            // Use functional setState to access latest messages without dependency
            setMessages((currentMessages) => {
                const conversationHistory = [...currentMessages];

                axios.post(API_URL, {
                    history: conversationHistory
                })
                    .then(response => {
                        const { role, content, prescription: rx } = response.data;
                        const assistantMessage = { role, content };

                        setMessages((prev) => [...prev, assistantMessage]);
                        if (rx) setPrescription(rx);

                        setLoading(false);
                    })
                    .catch(err => {
                        console.error("Chat Error:", err);
                        const errorMsg = err.response?.data?.message || err.response?.data?.error?.message || "Unable to connect to Dhanwantari. Please ensure the server is running.";
                        setError(errorMsg);
                        setLoading(false);
                    });

                return currentMessages; // Return unchanged for this setState
            });

        } catch (err) {
            console.error("Chat Error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error?.message || "Unable to connect to Dhanwantari. Please ensure the server is running.";
            setError(errorMsg);
            setLoading(false);
        }
    }, []); // Empty dependency array - no unnecessary re-renders

    return { messages, loading, error, sendMessage, prescription };
};
