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
import Membership from "@/components/sections/membership"
import Newsletter from "@/components/sections/newsletter"
import OurProjects from "@/components/sections/our-projects"
import Presidents from "@/components/sections/presidents"
import Projects from "@/components/sections/projects"
import Testimonials from "@/components/sections/testimonials"
import Welcome from "@/components/sections/welcome"
import WhyJoin from "@/components/sections/why-join"

export default function Home() {
  return (
    <main>
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
      <Membership />
      <WhyJoin />
      <InstagramFeed />
      <Newsletter />
      <Contact />
      <CallToAction />
    </main>
  )
}

