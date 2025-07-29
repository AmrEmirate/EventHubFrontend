/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // BARIS INI PENTING UNTUK MENAMPILKAN GAMBAR DARI LOKAL
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Sesuaikan dengan port backend Anda
        pathname: "/uploads/**",
      },
      // Pola lain yang sudah ada
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
    // unoptimized: true, // Anda bisa coba hapus baris ini jika masih ada masalah
  },
};

module.exports = nextConfig;
