import Header from '@/components/header'
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/footer'
import Auth from '@/components/authentication/auth'
import { ContextProvider } from '../context/context'
import GeneralLayout from './generalLayout'
import { PortfolioContextProvider } from '../context/portfolioContext'

const inter = Inter({
  weight: ['400', "500", "600", "700", "800"],
  style: ['normal'], 
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: 'Connify',
  description: 'Get access to latest prices of cryptocurrency and data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <PortfolioContextProvider>
            <Auth />
            <Header/>
              <GeneralLayout>
                {children}
              </GeneralLayout>
            <Footer />
          </PortfolioContextProvider>
        </ContextProvider>
      </body>
    </html>
  )
}
