/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['mapbox-gl'],
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, 'mapbox-gl': 'mapbox-gl' };
    return config;
  },
  env: {
    NEXT_PUBLIC_LE_API_URL: process.env.NEXT_PUBLIC_LE_API_URL,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
};
module.exports = nextConfig;
