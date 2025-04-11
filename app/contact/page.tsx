"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  MessageSquare,
  Home,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [activeTab, setActiveTab] = useState("general")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
    // Show success message
    alert("Thank you for your message. We will get back to you soon!")
  }

  // Refs for scroll animations
  const heroRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)
  const mapRef = useRef(null)
  const faqRef = useRef(null)
  const socialRef = useRef(null)

  // Check if elements are in view
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const formInView = useInView(formRef, { once: true, amount: 0.3 })
  const infoInView = useInView(infoRef, { once: true, amount: 0.3 })
  const mapInView = useInView(mapRef, { once: true, amount: 0.3 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 })
  const socialInView = useInView(socialRef, { once: true, amount: 0.3 })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  }

  const slideInLeftVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const slideInRightVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  }

  const scaleUpVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  }

  const faqs = [
    {
      question: "How can I become a member of Eko Club International?",
      answer:
        "To become a member, you can fill out the membership application form on our website or contact your local chapter. Membership is open to individuals of Lagos descent or those who have a strong connection to Lagos culture and heritage.",
    },
    {
      question: "How long does it typically take to get a response to my inquiry?",
      answer:
        "We strive to respond to all inquiries within 24-48 hours during business days. For urgent matters, we recommend calling our office directly.",
    },
    {
      question: "Can I volunteer for Eko Club International events and initiatives?",
      answer:
        "Yes, we welcome volunteers! Please fill out our volunteer form or contact us directly to express your interest and let us know your skills and availability.",
    },
    {
      question: "How can I make a donation to support your projects?",
      answer:
        "You can make donations through our website's donation page, by mail, or by contacting our office directly. All donations are tax-deductible as allowed by law.",
    },
    {
      question: "Do you offer sponsorship opportunities for businesses?",
      answer:
        "Yes, we offer various sponsorship packages for businesses interested in supporting our events and initiatives. Please contact our partnerships team for more information.",
    },
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/ekoclubinternational" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/ekoclubintl" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/ekoclubinternational" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/eko-club-international" },
  ]

  const contactCategories = [
    { id: "general", label: "General Inquiries" },
    { id: "membership", label: "Membership" },
    { id: "donations", label: "Donations" },
    { id: "media", label: "Media Relations" },
  ]

  return (
    <main className="pt-16 bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b mt-16 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <motion.div
          className="container mx-auto px-4 relative z-10 text-center"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4" variants={itemVariants}>
            GET IN <span className="text-[#C8A97E] font-medium">TOUCH</span>
          </motion.h1>
          <motion.div className="h-0.5 bg-[#C8A97E] w-20 mx-auto mb-6" variants={scaleUpVariants}></motion.div>
          <motion.p className="text-white text-lg md:text-xl max-w-2xl mx-auto" variants={itemVariants}>
            We'd love to hear from you. Reach out to us with any questions, feedback, or inquiries.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={slideInLeftVariants}
              className="bg-white p-6 md:p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl md:text-3xl font-medium mb-6">Send Us a Message</h2>

              <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                  {contactCategories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-[#C8A97E] data-[state=active]:text-white"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {contactCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <motion.form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      <motion.div variants={itemVariants}>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] py-6"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] py-6"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Input
                          type="text"
                          name="subject"
                          placeholder={`Subject (${category.label})`}
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] py-6"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Textarea
                          name="message"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] min-h-[150px]"
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Button
                          type="submit"
                          className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none py-6 uppercase flex items-center justify-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Send Message
                        </Button>
                      </motion.div>
                    </motion.form>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              ref={infoRef}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              variants={slideInRightVariants}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-medium">Contact Information</h2>
              <p className="text-gray-600">
                We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
              </p>

              <motion.div
                initial="hidden"
                animate={infoInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-[#C8A97E] p-3 rounded-full text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Our Location</h4>
                    <p className="text-gray-600">123 Main Street, Atlanta, GA 30303</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-[#C8A97E] p-3 rounded-full text-black">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Phone Number</h4>
                    <p className="text-gray-600">267-444-0066</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-[#C8A97E] p-3 rounded-full text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Address</h4>
                    <p className="text-gray-600">info@ekoclubinternational.org</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-[#8A6D3B] p-3 rounded-full text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Office Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInVariants} className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#C8A97E]" />
                  Quick Response
                </h4>
                <p className="text-gray-600">
                  For urgent inquiries, please call our office directly. We strive to respond to all email inquiries
                  within 24-48 hours during business days.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <motion.section
        ref={mapRef}
        initial="hidden"
        animate={mapInView ? "visible" : "hidden"}
        variants={fadeInVariants}
        className="py-12 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-light mb-4">
              FIND <span className="text-[#C8A97E] font-medium">US</span>
            </motion.h2>
            <motion.div variants={scaleUpVariants} className="h-0.5 bg-[#C8A97E] w-20 mx-auto mb-6"></motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
              Visit our headquarters or find a chapter near you.
            </motion.p>
          </div>

          <motion.div
            variants={scaleUpVariants}
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg"
          >
            {/* Replace with actual map component or iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212270.7411321579!2d-84.56068880343752!3d33.767633149999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA%2C%20USA!5e0!3m2!1sen!2sng!4v1712798400000!5m2!1sen!2sng"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Eko Club International Headquarters"
            ></iframe>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        ref={faqRef}
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 md:py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-light mb-4">
              FREQUENTLY ASKED <span className="text-[#C8A97E] font-medium">QUESTIONS</span>
            </motion.h2>
            <motion.div variants={scaleUpVariants} className="h-0.5 bg-[#C8A97E] w-20 mx-auto mb-6"></motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about contacting and engaging with Eko Club International.
            </motion.p>
          </div>

          <motion.div variants={fadeInVariants} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate={faqInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${index}`} className="border-b border-gray-200 py-2">
                    <AccordionTrigger className="text-left font-medium hover:text-[#C8A97E] transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Media Section */}
      <motion.section
        ref={socialRef}
        initial="hidden"
        animate={socialInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-light mb-4">
              CONNECT WITH <span className="text-[#C8A97E] font-medium">US</span>
            </motion.h2>
            <motion.div variants={scaleUpVariants} className="h-0.5 bg-[#C8A97E] w-20 mx-auto mb-6"></motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
              Follow us on social media to stay updated with our latest news, events, and initiatives.
            </motion.p>
          </div>

          <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={scaleUpVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="bg-[#C8A97E] p-4 rounded-full text-white mb-4">
                  <social.icon className="h-6 w-6" />
                </div>
                <span className="font-medium">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <section className="py-16 bg-[#C8A97E]">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-medium text-white mb-6"
          >
            Ready to Get Involved?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 max-w-2xl mx-auto mb-8"
          >
            Join our community today and be part of our mission to preserve and promote Lagos heritage and culture.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button className="bg-white text-[#C8A97E] hover:bg-gray-100 transition-colors duration-300 rounded-none px-8 py-6">
              <Link href="/membership">Become a Member</Link>
            </Button>
            <Button className="bg-[#8A6D3B] text-white hover:bg-[#7A5D2B] transition-colors duration-300 rounded-none px-8 py-6">
              <Link href="/donate">Support Our Cause</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
