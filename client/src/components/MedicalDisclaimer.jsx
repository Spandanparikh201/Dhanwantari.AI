import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = () => {
    return (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-200 mb-1">
                        Educational Use Only
                    </h3>
                    <p className="text-xs text-amber-100/80 leading-relaxed">
                        This AI assistant is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                        Always seek the advice of qualified health providers with any questions regarding a medical condition.
                        Never disregard professional medical advice or delay seeking it because of information from this application.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MedicalDisclaimer;
