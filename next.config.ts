import type { NextConfig } from "next";

const nextConfig = {
  output: 'export', // Isso habilita a exportação estática
  distDir: 'out', // Pasta onde os arquivos estáticos serão gerados
  images: {
    unoptimized: true, // Necessário para exportação estática
  },
  // Remova a configuração basePath se não estiver usando subdiretório
  trailingSlash: true, // Recomendado para exportação estática
};

module.exports = nextConfig;

export default nextConfig;
