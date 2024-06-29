/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
