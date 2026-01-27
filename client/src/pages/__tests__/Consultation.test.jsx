
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Consultation from '../Consultation';
import { vi } from 'vitest';

// Mock imports
vi.mock('../../hooks/useAuth', () => ({
    useAuth: vi.fn()
}));
vi.mock('../../components/chat/ChatInterface', () => ({
    ChatInterface: () => <div data-testid="chat-interface">Mock Chat</div>
}));

import { useAuth } from '../../hooks/useAuth';

describe('Consultation Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login required state when no user', () => {
        useAuth.mockReturnValue({ user: null });
        render(
            <BrowserRouter>
                <Consultation />
            </BrowserRouter>
        );
        expect(screen.getByText(/AUTHENTICATION_REQUIRED/)).toBeInTheDocument();
    });

    it('renders start button when user is logged in', () => {
        useAuth.mockReturnValue({ user: { id: '1', name: 'Test User' } });
        render(
            <BrowserRouter>
                <Consultation />
            </BrowserRouter>
        );
        expect(screen.getByText(/INITIATE_PROTOCOL/)).toBeInTheDocument();
    });

    it('switches to chat interface on start click', () => {
        useAuth.mockReturnValue({ user: { id: '1', name: 'Test User' } });
        render(
            <BrowserRouter>
                <Consultation />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/INITIATE_PROTOCOL/));
        expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    });
});
