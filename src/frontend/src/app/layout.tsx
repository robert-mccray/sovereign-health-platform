import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- This imports the styles

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sovereign Evidence Portal",
  description: "Secure Clinical Ingestion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}