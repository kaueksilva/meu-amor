"use client";

import React, { useState, useEffect } from "react";

interface PhotoCarouselProps {
  images: string[];
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ images }) => {
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [nextIndices, setNextIndices] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Inicializa com 4 imagens aleatórias
  useEffect(() => {
    if (images.length > 0) {
      const initialIndices = getRandomIndices(4);
      setCurrentIndices(initialIndices);
    }
  }, [images]);

  // Gera índices aleatórios únicos
  const getRandomIndices = (count: number) => {
    const indices = new Set<number>();
    while (indices.size < count && indices.size < images.length) {
      const randomIndex = Math.floor(Math.random() * images.length);
      if (!failedImages.has(randomIndex)) {
        indices.add(randomIndex);
      }
    }
    return Array.from(indices);
  };

  // Efeito para trocar todas as imagens periodicamente
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      // Prepara as próximas imagens
      const newIndices = getRandomIndices(4);
      setNextIndices(newIndices);
      
      // Inicia a transição
      setIsTransitioning(true);
      
      // Termina a transição após a animação
      setTimeout(() => {
        setCurrentIndices(newIndices);
        setIsTransitioning(false);
      }, 1000); // Duração da animação: 1 segundo
    }, 5000); // 5 segundos visíveis

    return () => clearInterval(interval);
  }, [images.length, failedImages]);

  const handleImageError = (index: number) => {
    console.error(`Erro ao carregar imagem: ${images[index]}`);
    setFailedImages(prev => new Set(prev).add(index));
    
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const errorPosition = newIndices.indexOf(index);
      if (errorPosition !== -1) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * images.length);
        } while (newIndices.includes(newIndex) || failedImages.has(newIndex));
        
        newIndices[errorPosition] = newIndex;
      }
      return newIndices;
    });
  };

  return (
    <div className="relative w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-2">
      {/* Imagens atuais saindo (desaparecendo) */}
      {currentIndices.map((index, i) => (
        <div 
          key={`current-${index}-${i}`}
          className="absolute inset-0"
          style={{
            gridArea: `${Math.floor(i/2)+1} / ${(i%2)+1} / span 1 / span 1`,
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 1s ease-in-out',
            zIndex: 10
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-1">
            <div className="relative h-full w-full flex items-center justify-center">
              <img
                src={images[index]}
                alt={`Nossa foto ${index + 1}`}
                className="h-[90%] w-[90%] object-contain"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  border: '10px solid white',
                  borderRadius: '6px'
                }}
                onError={() => handleImageError(index)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Novas imagens entrando (aparecendo) */}
      {isTransitioning && nextIndices.map((index, i) => (
        <div 
          key={`next-${index}-${i}`}
          className="absolute inset-0"
          style={{
            gridArea: `${Math.floor(i/2)+1} / ${(i%2)+1} / span 1 / span 1`,
            opacity: isTransitioning ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: 20
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-1">
            <div className="relative h-full w-full flex items-center justify-center">
              <img
                src={images[index]}
                alt={`Nossa foto ${index + 1}`}
                className="h-[90%] w-[90%] object-contain"
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  border: '10px solid white',
                  borderRadius: '6px'
                }}
                onError={() => handleImageError(index)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Estilos globais para o grid */}
      <style jsx global>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
        }
      `}</style>
    </div>
  );
};

export default PhotoCarousel;