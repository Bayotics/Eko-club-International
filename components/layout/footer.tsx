import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png"
                alt="Eko Club Logo"
                width={80}
                height={80}
                className="h-auto w-auto"
              />
            </div>
            <h3 className="text-xl font-medium">Eko Club International</h3>
            <p className="text-gray-400">Together We Can Make A Difference!</p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="hover:text-[#C8A97E] transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" className="hover:text-[#C8A97E] transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="hover:text-[#C8A97E] transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://youtube.com" className="hover:text-[#C8A97E] transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="https://linkedin.com" className="hover:text-[#C8A97E] transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#C8A97E] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-[#C8A97E] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#events" className="text-gray-400 hover:text-[#C8A97E] transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-gray-400 hover:text-[#C8A97E] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-400 hover:text-[#C8A97E] transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Chapters</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Atlanta</li>
              <li>Austin</li>
              <li>California</li>
              <li>Dallas</li>
              <li>London, U.K.</li>
              <li>
                <Link href="/chapters" className="text-[#C8A97E] hover:underline">
                  View All Chapters
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Phone: 267-444-0066</li>
              <li>
                <a href="mailto:info@ekoclubinternational.org" className="hover:text-[#C8A97E] transition-colors">
                  info@ekoclubinternational.org
                </a>
              </li>
              <li>
                <a href="http://www.ekoclub.org" className="hover:text-[#C8A97E] transition-colors">
                  www.ekoclub.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Eko Club International. All rights reserved.</p>
          <div className="text-xs text-gray-600">design and development by <Link target="_blank" href="https://bayotics.github.io/updated-portfolio/">Ab Sho</Link></div>
        </div>
      </div>
    </footer>
  )
}

