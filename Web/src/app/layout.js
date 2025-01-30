import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { SessionProvider } from '../components/SessionProvider'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Formcarry Clone',
  description: 'Clone de Formcarry avec système e-commerce',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession()

  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 