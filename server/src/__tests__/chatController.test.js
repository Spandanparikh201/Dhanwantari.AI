
const chatController = require('../controllers/chatController');
const DatabaseService = require('../services/DatabaseService');
const AIProviderFactory = require('../services/ai/AIProviderFactory');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('../services/DatabaseService');
jest.mock('../services/ai/AIProviderFactory');

describe('Chat Controller', () => {
    let mockPool;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPool = { execute: jest.fn() };
        DatabaseService.pool = mockPool;
        DatabaseService.initPromise = Promise.resolve();
    });

    describe('chat', () => {
        it('should return error if history is invalid', async () => {
            const req = mockRequest({ body: { history: 'invalid' } });
            const res = mockResponse();

            await chatController.chat(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid request' }));
        });

        it('should generate response and archive chat', async () => {
            const req = mockRequest({
                body: {
                    history: [{ role: 'user', content: 'Hello' }]
                },
                user: { id: 'user123' }
            });
            const res = mockResponse();

            // Mock AI
            const mockAIProvider = {
                initialize: jest.fn(),
                generateResponse: jest.fn().mockResolvedValue('AI Response')
            };
            AIProviderFactory.createProvider.mockReturnValue(mockAIProvider);

            // Mock DB: Find active consultation (none found first)
            mockPool.execute
                .mockResolvedValueOnce([[]]) // Select consultation -> empty
                .mockResolvedValueOnce([]) // Insert consultation
                .mockResolvedValueOnce([]) // Insert user message
                .mockResolvedValueOnce([]); // Insert ai message

            await chatController.chat(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                content: 'AI Response',
                role: 'assistant'
            }));
            expect(mockPool.execute).toHaveBeenCalledTimes(4); // Select + Insert Consult + Insert 2 Msgs
        });
    });

    describe('endConsultation', () => {
        it('should return 404 if no active consultation', async () => {
            const req = mockRequest({ user: { id: 'user123' } });
            const res = mockResponse();

            mockPool.execute.mockResolvedValueOnce([[]]); // No rows

            await chatController.endConsultation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should mark consultation as completed', async () => {
            const req = mockRequest({ user: { id: 'user123' } });
            const res = mockResponse();

            mockPool.execute
                .mockResolvedValueOnce([[{ id: 'cons123' }]]) // Found active
                .mockResolvedValueOnce([]); // Update status

            await chatController.endConsultation(req, res);

            expect(mockPool.execute).toHaveBeenNthCalledWith(2,
                expect.stringContaining("UPDATE consultations SET status = 'completed'"),
                ['cons123']
            );
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Consultation ended successfully' }));
        });
    });
});
