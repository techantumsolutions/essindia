import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { getSiteUrl } from "@/lib/seo/site-url";
import { Toaster } from "@/components/ui/sonner";
import { FormModalProvider } from "@/components/ui/FormModalProvider";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ESS India - Enterprise ERP & Digital Transformation",
    template: "%s | ESS India",
  },
  description: "Enterprise software solutions, AI automation, and digital transformation for modern businesses.",
  openGraph: {
    type: "website",
    siteName: "ESS India",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
        <FormModalProvider />
      </body>
    </html>
  );
}
