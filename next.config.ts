import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Trim barrel imports so only the icons/components actually used are bundled,
  // instead of the whole library, on every route that touches them.
  experimental: {
    optimizePackageImports: [
      "recharts",
      "framer-motion",
      "react-markdown",
      "remark-gfm",
      "@codesandbox/sandpack-react",
    ],
  },
  // Sourcemaps in prod bloat the deployment and leak nothing useful to users.
  productionBrowserSourceMaps: false,
};

export default nextConfig;
