/** @type {import('next').NextConfig} */

const defaultTheme = require('tailwindcss/defaultTheme')

const { screens } = defaultTheme

const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: false,
  reactStrictMode: true,
  publicRuntimeConfig: {
    breakpoints: screens,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
  },
  optimizeFonts: false
}

module.exports = nextConfig
