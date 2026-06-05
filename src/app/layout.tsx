import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESS India - Enterprise ERP & Digital Transformation",
  description: "Enterprise software solutions, AI automation, and digital transformation for modern businesses.",
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
      </body>
    </html>
  );
}
