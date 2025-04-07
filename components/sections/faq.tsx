"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircleQuestionIcon as QuestionCircle } from "lucide-react"
import Image from "next/image"

// FAQ items data
const faqItems = [
  {
    question: "How can I reset my password?",
    answer:
      'Go to the login page and click on the "Forgot password" link. Enter the email associated with your account, and you will receive an email with instructions on how to reset your password.',
  },
  {
    question: "How do I change my privacy settings?",
    answer:
      'To change your privacy settings, log in and go to the settings or account page. Look for an option to "Privacy" or "Security" and follow the instructions.',
  },
  {
    question: "How can I contact customer support?",
    answer:
      'To contact customer support, look for a "Contact us" or "Help" button or link on the website or platform. You may be able to email, call, or chat with customer support for assistance.',
  },
  {
    question: "What benefits do members receive?",
    answer:
      "Members enjoy access to exclusive events, networking opportunities, voting rights in club elections, participation in community service projects, and regular newsletters. Premium and Lifetime members receive additional benefits.",
  },
  {
    question: "How often do you host events?",
    answer:
      "We host events regularly throughout the year, including monthly meetings, quarterly networking sessions, annual galas, and special cultural celebrations. Our calendar is always full of opportunities for members to connect.",
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
                    <p className="text-gray-600">{item.answer}</p>
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
              <Image src="/images/faq-person.png" alt="Person using laptop" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

