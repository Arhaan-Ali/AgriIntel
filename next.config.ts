import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=(self)",
          },
        ],
      },
    ];
  },
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",  // Required
        hostname: "openweathermap.org", // Required
        port: "", // Optional
        pathname: "/**", // Optional
      },
    ],
  },
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.29.44:3000"],
};

export default nextConfig;
