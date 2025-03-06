import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// pablishing Github Pages

const nextConfig: NextConfig = {
  output: "export",
  images: { 
    unoptimized: true 
  }
};

export default nextConfig;