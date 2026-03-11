/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker: produces a self-contained server.js in .next/standalone
  output: "standalone",
};

export default nextConfig;
