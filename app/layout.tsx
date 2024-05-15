import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Date Picker",
  description:
    "A date picker component for Next.js created with Tailwind CSS by @abhishek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster richColors />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
