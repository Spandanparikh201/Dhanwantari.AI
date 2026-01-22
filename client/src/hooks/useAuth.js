import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial load from local storage
        const loadUser = () => {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (userData && token) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error("Failed to parse user data", error);
                    localStorage.removeItem('user'); // Clear corrupted data
                }
            }
            setLoading(false);
        };

        loadUser();

        // Optional: Listen for storage events if we want multi-tab sync (basic version)
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return { user, loading, logout };
};
