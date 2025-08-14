
import React from 'react';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { PauseIcon } from './icons/PauseIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface TtsButtonProps {
    onClick: () => void;
    state: 'idle' | 'loading' | 'playing';
}

export const TtsButton: React.FC<TtsButtonProps> = ({ onClick, state }) => {
    const renderIcon = () => {
        switch (state) {
            case 'loading':
                return <LoadingSpinner className="w-5 h-5 text-brand-accent" />;
            case 'playing':
                return <PauseIcon className="w-5 h-5 text-brand-accent" />;
            case 'idle':
            default:
                return <SpeakerIcon className="w-5 h-5 text-zinc-500 group-hover:text-brand-accent" />;
        }
    };

    return (
        <button 
            onClick={onClick}
            className="group p-2 ml-2 rounded-full transition-colors duration-200 hover:bg-black/5 flex-shrink-0"
            aria-label="Reproducir descripción"
        >
            {renderIcon()}
        </button>
    );
};
