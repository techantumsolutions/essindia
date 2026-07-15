import type { NextConfig } from "next";
import { getPreferredHost, getSiteUrl, shouldForceHttps } from "./src/lib/seo/site-url";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
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
