import React, { useState } from 'react';
import type { Product } from '../types';
import { generateAndPlayAudio, generateReindeerDialogue, generateEventIdeas } from '../services/geminiService';
import './elegant-catalog.css';
// Importar Playfair Display desde Google Fonts
// Puedes poner esto en tu layout global o index.html:
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
// O en tu CSS global:
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

interface ProductSectionProps {
    product: Product;
    onGenerateIdeas: (product: Product) => void;
    isReversed: boolean;
    audioPlayer: HTMLAudioElement | null;
    setAudioPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ product, onGenerateIdeas, isReversed, audioPlayer, setAudioPlayer }) => {
    const images = product.images || [];
    const features = product.features || [];
    const specs = product.specs || [];
    const [activeImage, setActiveImage] = useState(images[0] || '');
    const [currentPlayingButton, setCurrentPlayingButton] = useState<HTMLSpanElement | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [localDescription, setLocalDescription] = useState(product.description);
    const [isGeneratingInline, setIsGeneratingInline] = useState(false);

    React.useEffect(() => {
        setLocalDescription(product.description);
    }, [product.description]);

    const handleInlineGenerate = async () => {
        if (isGeneratingInline) return;
        setIsGeneratingInline(true);
        try {
            const ideas = await generateEventIdeas(product.title, product.aiPromptDescription || '');
            setLocalDescription(ideas); // Cambia en el DOM instantáneamente sin recargar
            
            await fetch('/.netlify/functions/update-product-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: product.id, description: ideas })
            });
        } catch (error) {
            console.error("Error inline AI:", error);
            alert('Error generando ideas con IA.');
        } finally {
            setIsGeneratingInline(false);
        }
    };

    const handleThumbnailClick = (image: string) => {
        if (image === activeImage) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveImage(image);
            setTimeout(() => setIsTransitioning(false), 500); // Duración de la animación
        }, 100);
    };

    // Asignación automática de personaje navideño según el producto
    const getCharacterByProduct = (productId: string) => {
        if (productId === 'reindeer') return 'reno';
        if (productId === 'trineo' || productId.toLowerCase().includes('santa')) return 'noel';
        if (productId === 'bailarina' || productId === 'flecha') return 'duende';
        if (productId === 'magic-elevator' || productId === 'elevator') return 'mamá';
        return 'noel'; // Por defecto
    };

    const handleTtsClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const button = e.currentTarget;
        const character = getCharacterByProduct(product.id);
        if (character === 'reno') {
            generateReindeerDialogue(button, audioPlayer, setAudioPlayer, currentPlayingButton, setCurrentPlayingButton);
        } else {
            // Se asume que generateAndPlayAudio acepta un parámetro extra 'character'
            generateAndPlayAudio(button, `desc-${product.id}`, audioPlayer, setAudioPlayer, currentPlayingButton, setCurrentPlayingButton);
        }
    };

    const imageColumn = (
        <div className="gallery-container flex flex-col items-center justify-center w-full">
            <div className={`w-full flex items-center justify-center transition-all duration-500 ${images.length > 1 ? 'relative' : ''} min-h-[1px]`}>
                <div
                    className={`main-image-frame ${images.length > 1 ? 'border-4 border-brand-accent' : ''} ${(isTransitioning) ? 'main-image-frame-zoom' : ''} main-image-frame-rel`}
                >
                    <span
                        className={`main-image-bg bg-img-${product.id}`}
                        aria-hidden="true"
                    />
                    {activeImage && (
                        <img
                            id={`main-img-${product.id}`}
                            src={activeImage}
                            alt={product.title}
                            className="main-image object-contain w-full max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] transition-all duration-500 main-image-rel"
                        />
                    )}
                </div>
            </div>
            {images.length > 1 && (
                <div className="flex items-center gap-4 mt-6 flex-wrap justify-center">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            onClick={() => handleThumbnailClick(img)}
                            src={img}
                            alt={`Miniatura de ${product.title} ${idx + 1}`}
                            className={`thumbnail w-20 h-20 object-contain rounded-md border-2 cursor-pointer transition-all duration-300 bg-white ${activeImage === img ? 'border-brand-accent' : 'border-transparent hover:border-brand-accent/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    const textColumn = (
        <div className="flex flex-col justify-center h-full px-2 md:px-6 lg:px-10">
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-text playfair-title" data-sb-field-path="title">{product.title}</h3>
                <button 
                  onClick={handleInlineGenerate} 
                  disabled={isGeneratingInline}
                  className={`text-4xl transition-transform hover:scale-125 focus:outline-none ${isGeneratingInline ? 'animate-bounce cursor-not-allowed opacity-70 grayscale' : 'cursor-pointer hover:-rotate-12 hover:drop-shadow-lg'}`}
                  title="Generar nueva descripción con IA de forma instantánea"
                >
                    🪄
                </button>
            </div>
            {product.tagline && <p className="text-xl md:text-2xl text-brand-accent mb-6 italic playfair-tagline">{product.tagline}</p>}
            
            {product.price !== undefined && (
                <div className="mb-6 flex items-center">
                    <span className="text-3xl font-bold text-green-700 font-mono tracking-tight" data-sb-field-path="price">
                        {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </span>
                </div>
            )}
            
            <div className="w-16 h-1 bg-brand-accent rounded-full mb-8"></div>
            <p id={`desc-${product.id}`} className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 playfair-desc relative" data-sb-field-path="description">
                {isGeneratingInline && <span className="absolute inset-0 bg-white/60 backdrop-blur-[1px] animate-pulse rounded-lg z-10"></span>}
                <span className="relative z-0">{localDescription}</span>
                <span className="tts-button ml-2 align-middle cursor-pointer relative z-20" onClick={handleTtsClick}>🔊</span>
            </p>
            
            {features.length > 0 && (
                <>
                    <h4 className="font-bold text-lg mb-3 montserrat-uppercase">Incluido en el Paquete:</h4>
                    <ul className="feature-list text-base mb-6 playfair-list">
                        {features.map((feature, idx) => <li key={idx} className="mb-1">{feature}</li>)}
                    </ul>
                </>
            )}
            
            {specs.length > 0 && (
                <table className="spec-table mb-8 montserrat-table">
                    <tbody>
                        {specs.map((spec, idx) => (
                            <tr key={idx}>
                                <td className="pr-2 text-gray-500">{spec.label}:</td>
                                <td className="font-semibold text-gray-700">{spec.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <div className="ai-button" onClick={() => onGenerateIdeas(product)}>
                <span className="inline-block bg-brand-accent text-white py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:shadow-brand-accent/30 hover:-translate-y-1 montserrat-btn">
                    Generar ideas con The Wizard IA
                </span>
            </div>
        </div>
    );

    // Generar estilos dinámicos para el fondo
    React.useEffect(() => {
        const styleId = `main-image-bg-style-${product.id}`;
        let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `.bg-img-${product.id} { background-image: url('${activeImage}'); }`;
        return () => {
            if (styleTag) styleTag.remove();
        };
    }, [activeImage, product.id]);

    return (
        <section className={`py-10 md:py-20 px-2 md:px-8 ${isReversed ? 'bg-white' : 'bg-gray-50'}`} data-sb-object-id={`packages/frontend/content/productos/${product.id}.md`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-stretch">
                <div className={`md:col-span-8 flex items-center justify-center w-full`}>
                    {imageColumn}
                </div>
                <div className="md:col-span-4 flex items-center justify-center w-full">
                    {textColumn}
                </div>
            </div>
        </section>
    );
};

