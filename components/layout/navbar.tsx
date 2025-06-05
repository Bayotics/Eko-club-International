"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  User,
  LogOut,
  Users,
  Calendar,
  FileText,
  Mail,
  Settings,
  DollarSign,
  UserPlus,
  Send,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  FiChevronDown,
  FiBook,
  FiTarget,
  FiAward,
  FiUsers,
  FiClock,
  FiHeart,
  FiHome,
  FiTrendingUp,
  FiPackage,
  FiStar,
  FiSmile,
  FiBookOpen,
  FiGlobe,
} from "react-icons/fi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/#about",
    hasDropdown: true,
    dropdownItems: [
      { name: "Our Story", href: "/about/our-story", icon: FiBook },
      { name: "Our Mission", href: "/about/our-mission", icon: FiTarget },
      { name: "Our Values", href: "/#about?section=values", icon: FiAward },
      { name: "Leadership", href: "/about/leadership", icon: FiUsers },
      { name: "History", href: "/#about?section=history", icon: FiClock },
    ],
  },
  {
    name: "Our Projects",
    href: "/#projects",
    hasDropdown: true,
    dropdownItems: [
      { name: "Medical Mission", href: "/projects/medical-mission", icon: FiHeart },
      { name: "Women Forum", href: "/projects/women-forum", icon: FiUsers },
      { name: "Lagos Community Outreach", href: "/projects/lagos-community-outreach", icon: FiHome },
      { name: "Empowerment Initiative", href: "/projects/empowerment-initiative", icon: FiTrendingUp },
      { name: "Food Palliative", href: "/projects/food-palliative", icon: FiPackage },
      { name: "ECI Youth", href: "/projects/eci-youth", icon: FiStar },
      { name: "Children Outreach Initiative", href: "/projects/children-outreach-initiative", icon: FiSmile },
      { name: "Education Initiative", href: "/projects/education-initiative", icon: FiBookOpen },
      { name: "Diaspora Outreach", href: "/projects/diaspora-outreach", icon: FiGlobe },
      { name: "ECI Mr. & Mrs. Eko", href: "/projects/mr-and-mrs-eko", icon: FiAward },
    ],
  },
  { name: "Events", href: "/events" },
  { name: "Chapters", href: "/chapters" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Use the auth context
  const { user, loading, logout } = useAuth()

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
    }
    return () => window.removeEventListener("scroll", handleScroll)
  })

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  const NavDropdown = ({ item, scrolled = false, isMobile = false }) => {
    const [open, setOpen] = useState(false)

    const wrapperVariants = {
      open: {
        scaleY: 1,
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
      closed: {
        scaleY: 0,
        opacity: 0,
        transition: {
          when: "afterChildren",
          staggerChildren: 0.1,
        },
      },
    }

    const iconVariants = {
      open: { rotate: 180 },
      closed: { rotate: 0 },
    }

    const itemVariants = {
      open: {
        opacity: 1,
        y: 0,
        transition: {
          when: "beforeChildren",
        },
      },
      closed: {
        opacity: 0,
        y: -15,
        transition: {
          when: "afterChildren",
        },
      },
    }

    const actionIconVariants = {
      open: { scale: 1, y: 0 },
      closed: { scale: 0, y: -7 },
    }

    const DropdownOption = ({ text, href, Icon, setOpen }) => {
      return (
        <motion.li
          variants={itemVariants}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 w-full p-2 text-sm font-medium whitespace-nowrap rounded-md hover:bg-gray-100 text-gray-700 hover:text-[#e4e66d] transition-colors cursor-pointer"
        >
          <motion.span variants={actionIconVariants} className="text-[#e4e66d]">
            <Icon />
          </motion.span>
          <Link href={href}>
            <span>{text}</span>
          </Link>
        </motion.li>
      )
    }

    if (isMobile) {
      return (
        <div className="py-3 border-b border-gray-100">
          <div className="flex justify-between items-center" onClick={() => setOpen(!open)}>
            <span className={`text-base font-medium ${open ? "text-[#91924f]" : "text-gray-800"}`}>{item.name}</span>
            <FiChevronDown className={`transition-transform ${open ? "rotate-180 text-[#e4e66d]" : ""}`} />
          </div>

          {open && (
            <ul className="mt-2 ml-4 space-y-2 max-h-60 overflow-y-auto">
              {item.dropdownItems.map((dropdownItem, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <dropdownItem.icon className="text-[#e4e66d] h-4 w-4" />
                  <Link
                    href={dropdownItem.href}
                    className="text-gray-600 hover:text-[#e4e66d]"
                    onClick={() => {
                      setIsOpen(false) // Close the main mobile menu
                      setOpen(false) // Close the dropdown
                    }}
                  >
                    {dropdownItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    return (
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((pv) => !pv)}
          className="flex items-center gap-1 px-1 py-2 text-sm font-medium transition-colors relative group"
        >
          <span
            className={
              pathname.includes(item.href)
                ? "text-[#e4e66d]"
                : scrolled || pathname !== "/"
                  ? "text-gray-800 group-hover:text-[#e4e66d]"
                  : "text-white group-hover:text-[#e4e66d]"
            }
          >
            {item.name}
          </span>
          <motion.span
            variants={iconVariants}
            className={
              pathname.includes(item.href)
                ? "text-[#e4e66d]"
                : scrolled || pathname !== "/"
                  ? "text-gray-800 group-hover:text-[#e4e66d]"
                  : "text-white group-hover:text-[#e4e66d]"
            }
          >
            <FiChevronDown />
          </motion.span>
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#e4e66d] transition-all duration-300 group-hover:w-full"></span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={wrapperVariants}
              style={{ originY: "top" }}
              className="flex flex-col gap-1 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-0 w-60 max-h-80 overflow-y-auto z-50"
            >
              {item.dropdownItems.map((dropdownItem, idx) => (
                <DropdownOption
                  key={idx}
                  setOpen={setOpen}
                  Icon={dropdownItem.icon}
                  text={dropdownItem.name}
                  href={dropdownItem.href}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png"
              alt="Eko Club Logo"
              width={72}
              height={72}
              // className="h-[4.5rem] w-auto"
              className={`${scrolled || pathname != "/" ? "h-[4.5rem] w-auto" : "h-[7rem] w-auto"} `}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-medium text-lg md:text-xl ml-2"
          >
            <span className={`${scrolled || pathname !== "/" ? "text-gray-800" : "text-yellow-300"}`}>EKO CLUB</span>{" "}
            <span className={`hidden sm:inline ${scrolled || pathname !== "/" ? "text-gray-800" : "text-white"}`}>
              INTERNATIONAL
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <NavDropdown key={item.name} item={item} scrolled={scrolled} />
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-1 py-2 text-sm font-medium transition-colors relative group",
                  pathname === item.href || (pathname === "/" && item.href === "/")
                    ? "text-[#bbbd59]"
                    : scrolled || pathname !== "/"
                      ? "text-gray-800 hover:text-[#a0a14b]"
                      : "text-white hover:text-[#aeaf53]",
                )}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#e4e66d] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ),
          )}
          <Button className="ml-4 bg-[#e4e66d] hover:bg-[#bcbe3a] text-gray-800 transition-colors duration-300 rounded-none px-6">
            <Link href="/donate">Donate</Link>
          </Button>
          {loading ? (
            <Button className="ml-2 bg-[#f38888] hover:bg-[oklch(53.7%_0.237_25.331)] text-white transition-colors duration-300 rounded-none px-6">
              <span className="animate-pulse">Loading...</span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-gray-100">
                  <Avatar className="h-8 w-8">
                    {user.profileImage ? (
                      <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.fullName} />
                    ) : (
                      <AvatarFallback className="bg-[#e4e66d] text-white">
                        {user.fullName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className={scrolled ? "text-sm font-medium" : "text-sm font-medium text-slate-400"}>
                      {user.fullName}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/members/dashboard" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/members/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                {/* Admin-specific menu items */}
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Administration</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Manage Users</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/invite" className="cursor-pointer">
                        <Send className="mr-2 h-4 w-4" />
                        <span>Invite Users</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/meetings" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Manage Meetings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/events" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Manage Events</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/meeting-minutes" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Manage Minutes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/newsletter" className="cursor-pointer">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Manage Newsletter</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/donations" className="cursor-pointer">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Manage Donations</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/subscribers" className="cursor-pointer">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Manage Subscribers</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/documents">
                        <FileText className="mr-2 h-4 w-4" />
                        Manage Documents
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/pending-users" className="cursor-pointer">
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>Pending Users</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="ml-2 bg-[#78b16d] hover:bg-[#2b5223] text-slate-100 transition-colors duration-300 rounded-none px-6">
              <Link href="/login">Members Login</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className={cn("h-6 w-6", scrolled || pathname !== "/" ? "text-gray-800" : "text-white")} />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t max-h-[80vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.hasDropdown ? (
                    <NavDropdown item={item} isMobile={true} />
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block py-3 text-base font-medium border-b border-gray-100",
                        pathname === item.href ? "text-[#e4e66d]" : "text-gray-800",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="mt-4"
              >
                <Button className="w-full bg-[#e4e66d] hover:bg-[#8A6D3B] text-gray-800 transition-colors duration-300 rounded-none">
                  <Link href="/donate" onClick={() => setIsOpen(false)}>
                    Donate Now
                  </Link>
                </Button>
              </motion.div>
              {loading ? null : user ? (
                <div className="py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user.profileImage ? (
                        <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.fullName} />
                      ) : (
                        <AvatarFallback className="bg-[#e4e66d] text-white">
                          {user.fullName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.fullName}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/members/dashboard"
                      className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/members/profile"
                      className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/admin/users"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Users
                        </Link>
                        <Link
                          href="/admin/invite"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Invite Users
                        </Link>
                        <Link
                          href="/admin/meetings"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Meetings
                        </Link>
                        <Link
                          href="/admin/events"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Events
                        </Link>
                        <Link
                          href="/admin/meeting-minutes"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Meeting Minutes
                        </Link>
                        <Link
                          href="/admin/newsletter"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Newsletter
                        </Link>
                        <Link
                          href="/admin/donations"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Donations
                        </Link>
                        <Link
                          href="/admin/subscribers"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Subscribers
                        </Link>
                        <Link
                          href="/admin/documents"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Manage Documents
                        </Link>
                        <Link
                          href="/admin/pending-users"
                          className="block py-1 text-sm text-gray-800 hover:text-[#e4e66d]"
                          onClick={() => setIsOpen(false)}
                        >
                          Pending Users
                        </Link>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-yellow-600"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <Button className="w-full bg-[#78b16d] hover:bg-[#2b5223] text-slate-100 transition-colors duration-300 rounded-none">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Members Login
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
