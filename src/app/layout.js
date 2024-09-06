import { Inter } from 'next/font/google'
import './globals.css'
import SideNavbar from '@/components/Navbar'
import Header from '@/components/Header'
import Providers from './Providers';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next App',
  description: 'Next.js starter app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen w-full flex-col bg-muted/40`}>
      <Providers>
      <SideNavbar />
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <Header />
        {children}
      </div>
      <Toaster />
      </Providers>
      </body>
    </html>
  )
}