import type React from "react"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/next';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Eko Club International - Together We Can Make A Difference",
  description:
    "Eko Club International is dedicated to community service and development projects with chapters worldwide.",
  icons: {
    icon: [
      {
        url: "/images/eko-club-logo.png",
        href: "/images/eko-club-logo.png",
        type: "image/png",
      },
    ],
    apple: "/images/eko-club-logo.png",
    shortcut: "/images/eko-club-logo.png",
  },
    generator: 'Ash linq technologies'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <AuthProvider>
              <Navbar />
              <div className="flex-grow">{children}  <Analytics /></div>
              <Footer />
              <Toaster />
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}