import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 静态站点
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? "/character-sheet-toolkit" : "",
  assetPrefix: isGithubPages ? "/character-sheet-toolkit/" : undefined,
  images: {
    unoptimized: true,
  },
  ...(process.env.BUILD_DIST_DIR ? { distDir: process.env.BUILD_DIST_DIR } : {}),
};

export default nextConfig;
