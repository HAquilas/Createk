/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.youtube.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig 