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
    const [consultationId, setConsultationId] = useState(null);

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

            const { role, content: assistantContent, prescription: rx, consultationId: cid } = response.data;
            const assistantMessage = { role, content: assistantContent };
            setMessages((prev) => [...prev, assistantMessage]);
            if (rx) setPrescription(rx);
            if (cid) setConsultationId(cid);

        } catch (err) {
            console.error("Chat Error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error?.message || "Unable to connect to Dhanwantari. Please ensure the server is running.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, [messages]); // Dependency on messages to construct history correctly

    const generatePrescription = async () => {
        if (!consultationId) {
            console.error('No consultationId available for prescription generation');
            return null;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/prescription/generate', {
                consultationId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // contains filename and downloadUrl
        } catch (err) {
            console.error('Generate Prescription Error:', err);
            return null;
        }
    };
    return { messages, loading, error, sendMessage, prescription, consultationId, generatePrescription };
};
