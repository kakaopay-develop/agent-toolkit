import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KakaoPay MCP Bot',
  description: 'MCP 기반 KakaoPay AI 챗봇',
  icons: {
    icon: 'https://t1.kakaocdn.net/kakaopay/icons/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 