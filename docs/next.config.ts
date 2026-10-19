import type { NextConfig } from "next";

// Static export, so the site can be hosted on GitHub Pages or any static host.
// For a project page (username.github.io/react-native-nativekit), build with BASE_PATH=/react-native-nativekit.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // The library's yarn.lock sits one level up; pin the root so Next treats this folder as its own project.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  // Lets `next dev` hydrate when opened from another device on the LAN (e.g. a phone).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
