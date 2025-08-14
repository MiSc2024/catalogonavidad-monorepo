import React, { useState } from 'react';
import './elegant-catalog.css';
import { VideoModal } from './VideoModal';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
    const [showVideo, setShowVideo] = useState(false);
    const videoUrl = "https://www.youtube.com/embed/SVS4fa2mIYM";

    return (
        <header className="h-screen bg-brand-header flex flex-col overflow-hidden">
            {/* Parte superior: imagen principal */}
            <div className="header-top flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center header-img-container">
                    <img
                        src="/header-trineo.webp"
                        alt="Imagen principal del catálogo de Navidad"
                        className="header-main-img"
                    />
                </div>
            </div>
            {/* Parte inferior: textos y CTA */}
            <div className="header-bottom relative z-10 text-right px-4 pb-8 md:pb-16">
                <h1
                    className="header-title-responsive text-white leading-tight playfair-title font-bold header-3d animate-shine"
                >
                    Atracciones Navideñas de Alto Impacto
                </h1>
                <div className="flex flex-row justify-end items-center gap-6 mt-4">
                    <span className="relative flex items-center animate-shine">
                        <SparklesIcon className="w-8 h-8 text-yellow-300 mr-2 animate-pulse" />
                        <span className="text-4xl md:text-5xl font-bold text-brand-accent playfair-title drop-shadow-lg">Cometa</span>
                    </span>
                    <span className="mx-2 text-4xl md:text-5xl font-bold text-white/80 playfair-title italic">y</span>
                    <span className="relative flex items-center animate-shine">
                        <SparklesIcon className="w-8 h-8 text-pink-300 mr-2 animate-pulse" />
                        <span className="text-4xl md:text-5xl font-bold text-brand-accent playfair-title drop-shadow-lg">Cupido</span>
                    </span>
                </div>
                <div className="text-right mt-2">
                    <span className="text-2xl md:text-3xl italic text-white/80 playfair-tagline font-semibold">Los renos favoritos de la Navidad 2025</span>
                </div>
                <p className="text-brand-accent mt-4 text-3xl md:text-4xl font-semibold playfair-desc">Las atracciones que convierten visitas en ventas</p>
                <p className="text-white mt-2 text-2xl md:text-3xl playfair-desc">Garantizamos filas de familias y compras prolongadas</p>
                <button
                    className="inline-block mt-8 px-8 py-4 bg-brand-accent text-white text-xl font-bold rounded-lg shadow-lg hover:bg-brand-accent/90 transition-all"
                    onClick={() => setShowVideo(true)}
                >
                    Ver la atracción en acción
                </button>
            </div>
            <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} videoUrl={videoUrl} />
        </header>
    );
};
