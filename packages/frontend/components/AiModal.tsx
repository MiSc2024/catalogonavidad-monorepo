
import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface AiModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    isLoading: boolean;
}

export const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, title, content, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-3xl text-brand-text">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none">&times;</button>
                </div>
                <div className="prose prose-zinc max-w-none">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale { animation: fadeInScale 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};
