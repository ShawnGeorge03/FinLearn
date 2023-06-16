import { Providers } from './providers';
import { ClerkProvider } from '@clerk/nextjs';

import { Metadata } from 'next';
import '@/styles/main.scss';
import Navbar from '@/components/Navbar';

import { Props } from '@/types/base';

export const metadata: Metadata = {
  title: 'FinLearn',
  description: 'A Financial Learning Site',
  icons: [
    {
      url: '/icons/favicon.ico',
      type: 'image/ico',
    },
    {
      url: '/icons/favicon-16x16.png',
      type: 'image/png',
      sizes: '16x16',
    },
    {
      url: '/icons/favicon-32x32.png',
      type: 'image/png',
      sizes: '32x32',
    },
    {
      rel: 'apple-touch-icon',
      url: '/icons/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
    {
      url: '/icons/android-chrome-192x192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      url: '/icons/android-chrome-512x512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
};

export default function RootLayout({ children }: Props) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
            <Navbar></Navbar>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
