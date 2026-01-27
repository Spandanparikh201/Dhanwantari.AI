
const prescriptionController = require('../controllers/prescriptionController');
const DatabaseService = require('../services/DatabaseService');
const PrescriptionService = require('../services/PrescriptionService');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const path = require('path');
const fs = require('fs');

jest.mock('../services/DatabaseService');
jest.mock('../services/PrescriptionService');
jest.mock('fs');

describe('Prescription Controller', () => {
    let mockPool;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPool = { execute: jest.fn() };
        DatabaseService.pool = mockPool;
        DatabaseService.initPromise = Promise.resolve();
    });

    describe('generatePrescription', () => {
        it('should return error if missing consultationId', async () => {
            const req = mockRequest({ body: {}, user: { id: 'u1' } });
            const res = mockResponse();

            await prescriptionController.generatePrescription(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should generate PDF if consultation exists', async () => {
            const req = mockRequest({
                body: { consultationId: 'c1' },
                user: { id: 'u1' }
            });
            const res = mockResponse();

            // Mock DB: Find consult
            mockPool.execute.mockResolvedValueOnce([[{
                id: 'c1',
                patient_id: 'u1',
                patient_name: 'John',
                date_of_birth: '1990-01-01',
                gender: 'Male',
                symptoms: JSON.stringify({ chief_complaint: 'Headache' }),
                prescription: JSON.stringify({ remedy: 'Arnica' }),
                created_at: new Date()
            }]]);

            // Mock DB: Update pdf path
            mockPool.execute.mockResolvedValueOnce([]);

            // Mock Service
            PrescriptionService.generatePDF.mockResolvedValue('/tmp/rx.pdf');

            await prescriptionController.generatePrescription(req, res);

            expect(PrescriptionService.generatePDF).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                filename: 'rx.pdf'
            }));
        });
    });

    describe('downloadPrescription', () => {
        it('should download file if valid owner', async () => {
            const req = mockRequest({
                params: { filename: 'rx.pdf' },
                user: { id: 'u1' }
            });
            const res = mockResponse();

            // Find consult (ownership check)
            mockPool.execute.mockResolvedValueOnce([[{ id: 'c1' }]]);

            // Mock File Exists
            PrescriptionService.getPrescriptionPath.mockReturnValue('/path/to/rx.pdf');
            fs.existsSync.mockReturnValue(true);

            await prescriptionController.downloadPrescription(req, res);

            expect(res.download).toHaveBeenCalledWith('/path/to/rx.pdf', 'rx.pdf', expect.any(Function));
        });
    });
});
