import type React from "react"
import { Montserrat } from "next/font/google"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <AntdRegistry>
            {children}
        </AntdRegistry>
      </body>
    </html>
  )
}