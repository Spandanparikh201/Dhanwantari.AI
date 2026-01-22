const pdfService = require('../services/pdfService');

exports.generatePrescription = async (req, res) => {
    try {
        const consultationData = req.body;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=prescription.pdf');

        pdfService.generatePrescription(consultationData, res);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate prescription' });
    }
};
