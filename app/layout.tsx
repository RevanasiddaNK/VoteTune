
import { Inter } from 'next/font/google'
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from './components/theme-toggle'
import { Providers } from "./components/provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import './globals.css'
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ['latin'] })



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'VoteTune - Collaborative Music Streaming',
  description: 'Create playlists, vote on songs, and stream music together with VoteTune.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900 dark:to-indigo-950 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="container mx-auto px-4 py-8">
            
            <header className="flex justify-between items-center mb-8 mx-4">
            
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-300 dark:to-indigo-400">
                VoteTune
              </h1>  
              <ThemeToggle />

            
            </header>

            <Providers>
            <Toaster/>
              {children}
            </Providers>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

