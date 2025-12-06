/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Set basePath for GitHub Pages project pages (username.github.io/repo-name)
  // For user/org pages at root (username.github.io), change to: basePath: ''
  // trailingSlash helps with GitHub Pages routing
  basePath: process.env.NODE_ENV === 'production' ? '/all-things-blog' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/all-things-blog' : '',
  trailingSlash: true,
}

module.exports = nextConfig

