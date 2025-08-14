import React from 'react';
import './elegant-catalog.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#181c2a] rounded-xl shadow-2xl p-4 md:p-8 max-w-3xl w-full relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-brand-accent transition" onClick={onClose}>&times;</button>
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            title="Video demostrativo"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full rounded-lg border-none"
          />
        </div>
      </div>
    </div>
  );
};
