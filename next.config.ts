import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    domains: [
      "patientportalapi.akosmd.in",
      "myeasypage.com",
      "res.cloudinary.com",
      "picsum.photos"
    ],
  },
};

export default nextConfig;
