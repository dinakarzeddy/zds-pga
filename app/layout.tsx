import { Pinyon_Script } from 'next/font/google'
import './globals.css'

const pinyon = Pinyon_Script({ weight: '400', subsets: ['latin'], variable: '--font-pinyon' })

export const metadata = {
  title: "ZD's PGA",
  description: 'Personal Grammar Assistant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={pinyon.variable}>{children}</body>
    </html>
  )
}