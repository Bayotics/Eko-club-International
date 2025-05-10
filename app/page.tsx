import { Raleway } from "next/font/google"
import About from "@/components/sections/about"
import CallToAction from "@/components/sections/call-to-action"
import Chapters from "@/components/sections/chapters"
import Contact from "@/components/sections/contact"
import Events from "@/components/sections/events"
import Faq from "@/components/sections/faq"
import Founder from "@/components/sections/founder"
import Gallery from "@/components/sections/gallery"
import Hero from "@/components/sections/hero"
import Impact from "@/components/sections/impact"
import InstagramFeed from "@/components/sections/instagram-feed"
import Newsletter from "@/components/sections/newsletter"
import OurProjects from "@/components/sections/our-projects"
import Presidents from "@/components/sections/presidents"
import Projects from "@/components/sections/projects"
import Testimonials from "@/components/sections/testimonials"
import Welcome from "@/components/sections/welcome"
import WhyJoin from "@/components/sections/why-join"

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
})

export default function Home() {
  return (
    <main className={`${raleway.variable} font-raleway`}>
      <Hero />
      <Welcome />
      <About />
      <Founder />
      <Impact />
      <Projects />
      <Gallery />
      <OurProjects />
      <Events />
      <Presidents />
      <Chapters />
      <Testimonials />
      <Faq />
      {/* <Membership /> */}
      <WhyJoin />
      <InstagramFeed />
      <Newsletter />
      <Contact />
      <CallToAction />
    </main>
  )
}
