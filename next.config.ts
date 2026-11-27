import type { NextConfig } from "next";

const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  ...(isStaticExport ? { trailingSlash: true } : {}),
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    unoptimized: isStaticExport,
  },
  ...(isStaticExport ? { output: "export" as const } : {}),
};

export default nextConfig;
