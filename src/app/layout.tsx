import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NuqsAdapter } from "nuqs/adapters/next"
import { ReactQueryProvider } from "./lib/react-query"

export const metadata: Metadata = {
  title: {
    template: "%s | Product Roadmap",
    default: "Product Roadmap",
  },
  description: "Follow the development progress of our entire platform.",
}

const interFont = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en" className={interFont.className} suppressHydrationWarning>
      <body className="bg-navy-950 text-navy-50 antialiased" suppressHydrationWarning>
        <ReactQueryProvider>
          <NuqsAdapter>
            {modal}
            {children}
          </NuqsAdapter>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
