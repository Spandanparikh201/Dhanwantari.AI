const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * PrescriptionService - Generates PDF prescriptions for consultations
 */
class PrescriptionService {
    constructor() {
        // Ensure prescriptions directory exists
        this.prescriptionsDir = path.join(__dirname, '../../prescriptions');
        if (!fs.existsSync(this.prescriptionsDir)) {
            fs.mkdirSync(this.prescriptionsDir, { recursive: true });
        }
    }

    /**
     * Generate a prescription PDF
     * @param {Object} data - Prescription data
     * @returns {Promise<string>} - Path to generated PDF
     */
    async generatePDF(data) {
        const {
            consultationId,
            patientName,
            patientAge,
            patientGender,
            doctorName,
            chiefComplaint,
            symptoms,
            remedy,
            potency,
            dosage,
            reasoning,
            date
        } = data;

        const filename = `prescription_${consultationId}_${Date.now()}.pdf`;
        const filepath = path.join(this.prescriptionsDir, filename);

        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const stream = fs.createWriteStream(filepath);

                doc.pipe(stream);

                // Header
                doc.fontSize(24)
                    .fillColor('#00ff9d')
                    .text('DHANWANTARI', { align: 'center' })
                    .fontSize(12)
                    .fillColor('#666')
                    .text('AI-Powered Homeopathy Consultation', { align: 'center' })
                    .moveDown(2);

                // Horizontal line
                doc.strokeColor('#00ff9d')
                    .lineWidth(2)
                    .moveTo(50, doc.y)
                    .lineTo(550, doc.y)
                    .stroke()
                    .moveDown();

                // Patient Information
                doc.fontSize(14)
                    .fillColor('#000')
                    .text('PATIENT INFORMATION', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(11)
                    .fillColor('#333')
                    .text(`Name: ${patientName}`)
                    .text(`Age: ${patientAge} years`)
                    .text(`Gender: ${patientGender}`)
                    .text(`Date: ${new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}`)
                    .moveDown(1.5);

                // Chief Complaint
                doc.fontSize(14)
                    .fillColor('#000')
                    .text('CHIEF COMPLAINT', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(11)
                    .fillColor('#333')
                    .text(chiefComplaint, { align: 'justify' })
                    .moveDown(1.5);

                // Symptoms
                if (symptoms && symptoms.length > 0) {
                    doc.fontSize(14)
                        .fillColor('#000')
                        .text('SYMPTOMS', { underline: true })
                        .moveDown(0.5);

                    doc.fontSize(11)
                        .fillColor('#333');

                    symptoms.forEach((symptom, index) => {
                        doc.text(`${index + 1}. ${symptom}`);
                    });
                    doc.moveDown(1.5);
                }

                // Prescription Box
                doc.rect(50, doc.y, 500, 120)
                    .fillAndStroke('#f0fdf4', '#00ff9d')
                    .fillColor('#000');

                const boxY = doc.y + 15;
                doc.fontSize(16)
                    .fillColor('#059669')
                    .text('℞ PRESCRIPTION', 70, boxY)
                    .moveDown(0.5);

                doc.fontSize(13)
                    .fillColor('#000')
                    .text(`Remedy: ${remedy}`, 70)
                    .text(`Potency: ${potency}`, 70)
                    .text(`Dosage: ${dosage}`, 70)
                    .moveDown(2);

                // Clinical Reasoning
                doc.fontSize(14)
                    .fillColor('#000')
                    .text('CLINICAL REASONING', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(10)
                    .fillColor('#333')
                    .text(reasoning, { align: 'justify' })
                    .moveDown(1.5);

                // Important Disclaimer
                doc.rect(50, doc.y, 500, 100)
                    .fillAndStroke('#fef2f2', '#ef4444')
                    .fillColor('#000');

                const disclaimerY = doc.y + 10;
                doc.fontSize(12)
                    .fillColor('#dc2626')
                    .text('⚠️ IMPORTANT DISCLAIMER', 70, disclaimerY)
                    .moveDown(0.3);

                doc.fontSize(9)
                    .fillColor('#333')
                    .text('This prescription is generated by AI and is for preliminary guidance only. It is NOT a substitute for professional medical advice. Please consult a licensed homeopathic practitioner for proper treatment. Do not discontinue any prescribed medications without consulting your doctor.', 70, doc.y, {
                        width: 460,
                        align: 'justify'
                    })
                    .moveDown(2);

                // Footer
                if (doctorName) {
                    doc.fontSize(11)
                        .fillColor('#666')
                        .text(`Reviewed by: ${doctorName}`, { align: 'right' });
                }

                doc.fontSize(9)
                    .fillColor('#999')
                    .text('Generated by Dhanwantari AI System', { align: 'center' })
                    .text(`Consultation ID: ${consultationId}`, { align: 'center' });

                // Finalize PDF
                doc.end();

                stream.on('finish', () => {
                    resolve(filepath);
                });

                stream.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get prescription file path
     * @param {string} filename - Prescription filename
     * @returns {string} - Full file path
     */
    getPrescriptionPath(filename) {
        return path.join(this.prescriptionsDir, filename);
    }

    /**
     * Delete old prescriptions (cleanup)
     * @param {number} daysOld - Delete files older than this many days
     */
    async cleanupOldPrescriptions(daysOld = 90) {
        const files = fs.readdirSync(this.prescriptionsDir);
        const now = Date.now();
        const maxAge = daysOld * 24 * 60 * 60 * 1000;

        for (const file of files) {
            const filepath = path.join(this.prescriptionsDir, file);
            const stats = fs.statSync(filepath);
            const age = now - stats.mtimeMs;

            if (age > maxAge) {
                fs.unlinkSync(filepath);
                console.log(`Deleted old prescription: ${file}`);
            }
        }
    }
}

module.exports = new PrescriptionService();
