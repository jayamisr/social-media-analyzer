import React from 'react';
import './globals.css'; // This connects your Tailwind styles to the project
import { Inter } from 'next/font/google';

// Setting up a clean, professional font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CORE AI | Social Intelligence Suite',
  description: 'Advanced AI-powered content extraction and lexical analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${inter.className} antialiased min-h-screen bg-[#0f172a] text-slate-200`}
        style={{ margin: 0 }} // Keeping margin 0 to prevent layout shifts
      >
        {children}
      </body>
    </html>
  );
}