
import React from 'react';
import './elegant-catalog.css';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white text-center py-12 px-8">
            <div className="max-w-7xl mx-auto border-t border-gray-200 pt-12">
                <h3 className="text-3xl text-brand-text playfair-title font-bold">Contacto</h3>
                <p className="mt-2 text-gray-500 playfair-desc">Para más información y reservas, póngase en contacto con nosotros.</p>
                <a
                    href="http://www.mundojuego.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block font-bold text-brand-accent text-lg hover:underline transition-all"
                >
                    www.mundojuego.es
                </a>
                <div className="mt-4 text-gray-500 space-y-1">
                    <p>+34 659 31 00 61</p>
                    <p>+34 672 85 46 88</p>
                </div>
            </div>
        </footer>
    );
};
