
import React from 'react';

interface ImageGalleryProps {
    images: string[];
    alts: string[];
    activeImage: string;
    setActiveImage: (url: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alts, activeImage, setActiveImage }) => {
    
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <img 
            src={images[0]} 
            alt={alts[0] || 'Imagen del producto'}
            className="w-full h-auto object-cover rounded-md shadow-2xl"
        />
      )
    }

    return (
        <div>
            <div className="mb-4 overflow-hidden rounded-md">
                <img 
                    src={activeImage} 
                    alt={alts[images.indexOf(activeImage)] || 'Imagen principal del producto'}
                    className="w-full h-auto object-cover transition-opacity duration-300 ease-in-out shadow-2xl"
                />
            </div>
            <div className="flex items-center gap-4">
                {images.map((img, index) => (
                    <div 
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`w-24 h-24 object-cover rounded-sm cursor-pointer border-2 transition-all duration-300
                            ${activeImage === img ? 'border-brand-accent' : 'border-transparent hover:border-brand-accent/50'}`
                        }
                    >
                        <img src={img} alt={alts[index] || `Miniatura ${index + 1}`} className="w-full h-full object-cover"/>
                    </div>
                ))}
            </div>
        </div>
    );
};
