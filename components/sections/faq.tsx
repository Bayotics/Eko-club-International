"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircleQuestionIcon as QuestionCircle } from "lucide-react"
import Image from "next/image"

const linkClass = "text-[#5D5FEF] underline underline-offset-2 hover:text-[#4A4CD8]"

const faqItems: { question: string; answer: ReactNode }[] = [
  {
    question: "What is Eko Club International?",
    answer:
      "Eko Club International is a community organization for Lagos indigenes and friends of Lagos around the world. It was officially inaugurated on April 3, 2000 and registered as a non-profit organization with the State of Texas. We are dedicated to preserving and promoting the rich cultural heritage of Lagos, Nigeria, while fostering unity, community development, and social welfare.",
  },
  {
    question: "Who can become a member?",
    answer:
      "Membership is open to Lagos indigenes and friends worldwide. You don't have to be from Lagos. If you share an interest in Lagos culture, heritage, and community development, you are welcome to join.",
  },
  {
    question: "How do I become a member?",
    answer: (
      <>
        Click <Link href="/login" className={linkClass}>Members Login</Link> and open the Register tab. Fill in your
        details and select your chapter, then verify your email using the link we send you (it expires after 24 hours).
        An administrator will then review and approve your registration and assign your Membership ID.
      </>
    ),
  },
  {
    question: "What do members have access to?",
    answer:
      "Once your registration is approved, your member dashboard gives you access to upcoming events and meetings, meeting minutes, and member-only documents. Members can also take part in our community projects and volunteer for events and leadership roles.",
  },
  {
    question: "Where are your chapters located?",
    answer: (
      <>
        We have chapters across the United States, Canada, and the United Kingdom. Visit our{" "}
        <Link href="/chapters" className={linkClass}>Chapters</Link> page to find one near you. When you register,
        you choose the chapter you belong to.
      </>
    ),
  },
  {
    question: "What projects does Eko Club run?",
    answer: (
      <>
        Our flagship Medical Mission provides free healthcare services to underserved communities in Lagos. We also run
        the Women Forum, ECI Youth, the Education Initiative, the Empowerment Initiative, Food Palliative, Children
        Outreach, Lagos Community Outreach, and Diaspora Outreach programs. Explore them under{" "}
        <span className="font-medium">Our Projects</span> in the menu.
      </>
    ),
  },
  {
    question: "How can I support the club's work?",
    answer: (
      <>
        You can give a one-off or monthly recurring donation on our{" "}
        <Link href="/donate" className={linkClass}>Donate</Link> page, in US dollars via PayPal or in Naira via
        Paystack. You can also volunteer at events or contribute your professional skills. Just{" "}
        <Link href="/contact" className={linkClass}>get in touch</Link>.
      </>
    ),
  },
  {
    question: "How do I find out about upcoming events?",
    answer: (
      <>
        All upcoming and past events are listed on our <Link href="/events" className={linkClass}>Events</Link> page,
        and featured events appear here on the homepage. Where an event requires registration, you'll find the
        registration link on the event's page. You can also subscribe to our monthly newsletter below.
      </>
    ),
  },
  {
    question: "What is the Eko Communicator?",
    answer: (
      <>
        The <Link href="/projects/eko-communicator" className={linkClass}>Eko Communicator</Link> is the official
        magazine of Eko Club International. Every edition can be read online for free.
      </>
    ),
  },
  {
    question: "How can I contact Eko Club International?",
    answer: (
      <>
        Email us at{" "}
        <a href="mailto:info@ekoclubinternational.org" className={linkClass}>info@ekoclubinternational.org</a> or call{" "}
        <a href="tel:+12674440066" className={linkClass}>267-444-0066</a>. You can also reach us through our{" "}
        <Link href="/contact" className={linkClass}>Contact</Link> page.
      </>
    ),
  },
]

export default function FAQ() {
  const [visibleItems, setVisibleItems] = useState(3)

  const showAllItems = () => {
    setVisibleItems(faqItems.length)
  }

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-medium mb-8"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/5">
            {faqItems.slice(0, visibleItems).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#5D5FEF] flex items-center justify-center text-white">
                    <QuestionCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {visibleItems < faqItems.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <button
                  onClick={showAllItems}
                  className="px-6 py-3 bg-[#5D5FEF] text-white rounded-full hover:bg-[#4A4CD8] transition-colors"
                >
                  View All FAQs
                </button>
              </motion.div>
            )}
          </div>

          <div className="w-full md:w-2/5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
            >
              <Image src="/images/faq-bg.jpg" alt="Eko Club International members at a club event" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

