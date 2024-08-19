// app/layout.js
'use client';

import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { CustomThemeProvider } from './ThemeContext';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <CustomThemeProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
          </body>
        </html>
      </CustomThemeProvider>
    </ClerkProvider>
  );
}