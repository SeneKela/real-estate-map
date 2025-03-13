/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/real-estate-map',
  assetPrefix: '/real-estate-map/',
}

module.exports = nextConfig 