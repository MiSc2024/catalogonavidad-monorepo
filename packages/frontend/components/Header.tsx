import React, { useState } from 'react';
import './Header.css';
import './elegant-catalog.css';
import { VideoModal } from './VideoModal';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
    const [showVideo, setShowVideo] = useState(false);
    const videoUrl = "https://www.youtube.com/embed/SVS4fa2mIYM";

    return (
        <header className="min-h-screen bg-brand-header flex flex-col overflow-hidden">
            {/* Parte superior: imagen principal */}
            <div className="header-top flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center header-img-container">
                  <img
  src="/header-trineo.webp"
  alt="Imagen principal del catálogo de Navidad"
  className="header-main-img header-main-img-mobile object-contain"
/>
                </div>
            </div>
            {/* Parte inferior: textos y CTA */}
            <div className="header-bottom relative z-10 text-center px-2 pb-6 md:pb-16">
                <h1
  className="header-title-responsive header-title-mobile text-white leading-tight playfair-title font-bold header-3d animate-shine text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
>
  Atracciones Navideñas de Alto Impacto
</h1>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mt-2 sm:mt-4">
                    <span className="relative flex items-center animate-shine">
                        <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300 mr-1 sm:mr-2 animate-pulse" />
                        <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-brand-accent playfair-title drop-shadow-lg">Cometa</span>
                    </span>
                    <span className="mx-1 sm:mx-2 text-2xl sm:text-4xl md:text-5xl font-bold text-white/80 playfair-title italic">y</span>
                    <span className="relative flex items-center animate-shine">
                        <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-pink-300 mr-1 sm:mr-2 animate-pulse" />
                        <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-brand-accent playfair-title drop-shadow-lg">Cupido</span>
                    </span>
                </div>
                <div className="text-center mt-2">
                    <span className="text-lg sm:text-2xl md:text-3xl italic text-white/80 playfair-tagline font-semibold block">Los renos favoritos de la Navidad 2025</span>
                </div>
                <p className="text-brand-accent mt-2 sm:mt-4 text-lg sm:text-2xl md:text-4xl font-semibold playfair-desc">Las atracciones que convierten visitas en ventas</p>
                <p className="text-white mt-1 sm:mt-2 text-base sm:text-xl md:text-3xl playfair-desc">Garantizamos filas de familias y compras prolongadas</p>
                <button
                    className="inline-block mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-brand-accent text-white text-base sm:text-xl font-bold rounded-lg shadow-lg hover:bg-brand-accent/90 transition-all"
                    onClick={() => setShowVideo(true)}
                >
                    Ver la atracción en acción
                </button>
            </div>
            <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} videoUrl={videoUrl} />
        </header>
    );
};
