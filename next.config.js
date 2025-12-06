/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If your repository name is not the root, uncomment and set the basePath
  // basePath: '/all-things-blog',
  // trailingSlash: true,
}

module.exports = nextConfig

