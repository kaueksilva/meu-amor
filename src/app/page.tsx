"use client";

import { useState, useRef, useEffect } from "react";
import HeartBackground from "../components/HeartBackground";
import PhotoCarousel from "../components/PhotoCarousel";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  // Carrega todas as imagens disponíveis (JPG, JPEG, PNG)
  useEffect(() => {
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    const totalImages = 64; // Ajuste para o número máximo de imagens
    
    const loadImages = async () => {
      const loadedImages = [];
      
      for (let i = 1; i <= totalImages; i++) {
        // Tenta encontrar a imagem em qualquer um dos formatos
        for (const ext of imageExtensions) {
          const imgPath = `/assets/fotos/${i}.${ext}`;
          try {
            const exists = await checkImageExists(imgPath);
            if (exists) {
              loadedImages.push(imgPath);
              break; // Se encontrou em um formato, não tenta os outros
            }
          } catch (e) {
            console.warn(`Erro ao verificar imagem ${imgPath}:`, e);
          }
        }
      }
      
      setAvailableImages(loadedImages);
      console.log('Imagens carregadas:', loadedImages);
    };
    
    loadImages();
  }, []);

  const checkImageExists = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleButtonClick = () => {
    setShowContent(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Autoplay prevented:", e));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showContent ? (
        <div className="w-full max-w-6xl flex flex-col items-center space-y-6 z-10">
          {/* Player de áudio visível */}
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={togglePlay}
                className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              <div>
                <p className="font-medium text-pink-700">Ruth B. - Dandelions</p>
                <p className="text-sm text-gray-500">Sua música especial</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {isPlaying ? "Tocando..." : "Pausado"}
            </div>
          </div>

          <audio ref={audioRef} autoPlay loop>
            <source src="/assets/RuthB-Dandelions.mp3" type="audio/mpeg" />
          </audio>

          {/* Carrossel de fotos em moldura */}
          <div className="relative w-full max-w-4xl h-[32rem] md:h-[40rem] overflow-hidden rounded-2xl shadow-xl border-8 border-white bg-white">
            {availableImages.length > 0 ? (
              <PhotoCarousel images={availableImages} />
            ) : (
              <div className="h-full flex items-center justify-center text-pink-600">
                Carregando imagens...
              </div>
            )}
          </div>

          {/* Mensagem romântica */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Para você, meu amor...</h2>
            <p className="text-gray-700 text-lg">
            Eu quero que saiba que sou um homem pequeno obviamente não preciso nem falar kkkkk, mas quando estou perto de você eu me sinto gigante e a pessoa mais forte do mundo por ter você ao meu lado, cada dia ao seu lado é um presente que eu guardo com todo cuidado no meu coração e eu quero você ao meu lado para sempre até meu último suspiro. Sua beleza, seu sorriso e seu amor iluminam minha vida de uma forma que palavras nunca poderão expressar completamente amor. Quero que você saiba que você é a pessoa mais especial do mundo para mim e agradeço sempre a DEUS por ter te colocado na minha vida, você apareceu na minha vida como uma luz na hora que eu mais precisava e eu sou o homem mais feliz do mundo por ter você ao meu lado e sei que vamos conquistar tudo que desejamos e sonhamos, quero conquistar nossa casinha juntos, ter nosso cachorrinho salsicha chamado slink kkkkk e no mínimo dois filhos para ficar correndo pela nossa casinha, todo o meu futuro eu só imagino com você nele amor. EU TE AMO mais do que todas as estrelas no céu e todas as gotas no oceano, não existe número e nem quantidade que consiga contar o amor que sinto por você. ❤️
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-8">
            Feliz Dia dos Namorados, Amor!
          </h1>
          <button
            onClick={handleButtonClick}
            className="bg-pink-100 hover:bg-pink-600 text-[#d11010] hover:text-[#fff] font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Clique em Mim ❤️
          </button>
        </div>
      )}

      {/* Fundo com corações */}
      <HeartBackground />
    </div>
  );
}