import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/guides",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/guides/:slug*",
        destination: "/writing/:slug*",
        permanent: true,
      },
      {
        source: "/writing/how-to-build-a-free-hd-image-background-remover-using-sam3",
        destination:
          "/writing/how-to-build-a-free-hd-image-background-remover-in-5-minutes",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
