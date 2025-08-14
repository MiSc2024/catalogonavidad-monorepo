
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface AiButtonProps {
    onClick: () => void;
}

export const AiButton: React.FC<AiButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group mt-8 inline-flex items-center gap-3 bg-brand-accent text-white py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-1"
        >
            <SparklesIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Generar ideas con The Wizard IA
        </button>
    );
};
