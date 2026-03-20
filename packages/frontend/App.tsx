
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductSection } from './components/ProductSection';
import { AiModal } from './components/AiModal';
import { generateEventIdeas } from './services/geminiService';
import { loadProducts } from './services/productLoader';
import type { Product } from './types';

const App: React.FC = () => {
    const productData = loadProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

    const handleOpenAiModal = useCallback(async (product: Product) => {
        setModalTitle(`Ideas para ${product.title}`);
        setIsModalOpen(true);
        setIsLoading(true);
        try {
            const ideas = await generateEventIdeas(product.title, product.aiPromptDescription || '');
            setModalContent(ideas);
            
            // Invocar la función serverless para guardar en el Markdown
            const updateResponse = await fetch('/.netlify/functions/update-product-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: product.id, description: ideas })
            });
            
            if (updateResponse.ok) {
                setModalContent(prev => prev + `
                    <div class="mt-8 p-6 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-r from-amber-50/90 to-white/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)] relative overflow-hidden" style="animation: fadeInUp 0.8s ease-out forwards; opacity: 0;">
                        <div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80"></div>
                        <div class="flex items-center justify-center gap-4">
                            <span class="text-3xl drop-shadow-md">✨</span>
                            <p class="text-[#1a1a1a] font-bold font-serif text-xl md:text-2xl tracking-wide m-0 text-center">¡Descripción guardada con éxito en tu CMS!</p>
                            <span class="text-3xl drop-shadow-md">🎄</span>
                        </div>
                    </div>
                    <style>
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(15px) scale(0.98); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    </style>
                `);
            } else {
                setModalContent(prev => prev + '<br/><hr/><p class="text-yellow-600 mt-4">⚠️ IA respondió, pero hubo un error al guardar localmente.</p>');
            }
        } catch (error) {
            console.error('Error generating ideas:', error);
            setModalContent('<p class="text-red-500">Ocurrió un error al conectar con el servicio de IA. Por favor, inténtalo de nuevo más tarde.</p>');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setModalContent('');
        setModalTitle('');
    }, []);

    return (
        <div className="w-full">
            <Header />
            <main>
                {productData.map((product, index) => (
                    <ProductSection
                        key={product.id}
                        product={product}
                        onGenerateIdeas={handleOpenAiModal}
                        isReversed={index % 2 !== 0}
                        setAudioPlayer={setAudioPlayer}
                        audioPlayer={audioPlayer}
                    />
                ))}
            </main>
            <Footer />
            <AiModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalTitle}
                isLoading={isLoading}
                content={modalContent}
            />
        </div>
    );
};

export default App;
