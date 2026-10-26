import type { NextConfig } from "next";
import { getPreferredHost, getSiteUrl, shouldForceHttps } from "./src/lib/seo/site-url";

const nextConfig: NextConfig = {
  // Uploaded media is read and written at runtime. Do not trace it into the server bundle.
  outputFileTracingExcludes: {
    '/*': ['./public/uploads/**/*'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // This host has 2 CPUs and 4 GB RAM. The default worker count OOMs `next build`.
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async redirects() {
    const preferredHost = getPreferredHost();
    const forceHttps = shouldForceHttps();
    const rules: { source: string; destination: string; permanent: boolean; has?: { type: 'host'; value: string }[] }[] = [];

    // Only apply host canonicalization when SITE URL is production HTTPS
    try {
      const site = new URL(getSiteUrl());
      if (site.protocol === 'https:' && preferredHost && process.env.ENABLE_HOST_REDIRECTS === 'true') {
        const nonWww = preferredHost.replace(/^www\./, '');
        const www = preferredHost.startsWith('www.') ? preferredHost : `www.${preferredHost}`;

        if (preferredHost.startsWith('www.')) {
          rules.push({
            source: '/:path*',
            has: [{ type: 'host', value: nonWww }],
            destination: `https://${www}/:path*`,
            permanent: true,
          });
        } else {
          rules.push({
            source: '/:path*',
            has: [{ type: 'host', value: www }],
            destination: `https://${nonWww}/:path*`,
            permanent: true,
          });
        }
      }
    } catch {
      // ignore invalid SITE URL in local/dev
    }

    void forceHttps;
    return rules;
  },
};

export default nextConfig;
