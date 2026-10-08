/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  ...(process.env.NODE_ENV === "development" ? { htmlLimitedBots: /.*/ } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
