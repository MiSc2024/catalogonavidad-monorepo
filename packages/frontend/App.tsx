
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductSection } from './components/ProductSection';
import { AiModal } from './components/AiModal';
import { generateEventIdeas } from './services/geminiService';
import { productData } from './constants';
import type { Product } from './types';

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

    const handleOpenAiModal = useCallback(async (product: Product) => {
        setModalTitle(`Ideas para ${product.name}`);
        setIsModalOpen(true);
        setIsLoading(true);
        try {
            const ideas = await generateEventIdeas(product.name, product.aiPromptDescription);
            setModalContent(ideas);
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
