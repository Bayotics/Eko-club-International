"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  Heart,
  ChevronRight,
  DollarSign,
  Calendar,
  Users,
  BookOpen,
  Award,
  HelpCircle,
  ArrowRight,
  Star,
  Briefcase,
  Gift,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DonatePage() {
  const [donationType, setDonationType] = useState("one-off")
  const [donationAmount, setDonationAmount] = useState("100")
  const [customAmount, setCustomAmount] = useState("")
  const [showRecognition, setShowRecognition] = useState(false)
  const [recognitionPreference, setRecognitionPreference] = useState("full")

  const [heroInView, setHeroInView] = useState(false)
  const [impactInView, setImpactInView] = useState(false)
  const [formInView, setFormInView] = useState(false)
  const [recognitionInView, setRecognitionInView] = useState(false)
  const [faqInView, setFaqInView] = useState(false)
  const [alternativeInView, setAlternativeInView] = useState(false)

  const heroRef = useRef(null)
  const impactRef = useRef(null)
  const formRef = useRef(null)
  const recognitionRef = useRef(null)
  const faqRef = useRef(null)
  const alternativeRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current) setHeroInView(entry.isIntersecting)
          if (entry.target === impactRef.current) setImpactInView(entry.isIntersecting)
          if (entry.target === formRef.current) setFormInView(entry.isIntersecting)
          if (entry.target === recognitionRef.current) setRecognitionInView(entry.isIntersecting)
          if (entry.target === faqRef.current) setFaqInView(entry.isIntersecting)
          if (entry.target === alternativeRef.current) setAlternativeInView(entry.isIntersecting)
        })
      },
      { threshold: 0.1, rootMargin: "0px" },
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (impactRef.current) observer.observe(impactRef.current)
    if (formRef.current) observer.observe(formRef.current)
    if (recognitionRef.current) observer.observe(recognitionRef.current)
    if (faqRef.current) observer.observe(faqRef.current)
    if (alternativeRef.current) observer.observe(alternativeRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (impactRef.current) observer.unobserve(impactRef.current)
      if (formRef.current) observer.unobserve(formRef.current)
      if (recognitionRef.current) observer.unobserve(recognitionRef.current)
      if (faqRef.current) observer.unobserve(faqRef.current)
      if (alternativeRef.current) observer.unobserve(alternativeRef.current)
    }
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const impactItems = [
    {
      icon: <Heart className="h-10 w-10 text-[#C8A97E]" />,
      title: "Medical Missions",
      description: "Fund medical supplies and healthcare services for communities in need.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-[#C8A97E]" />,
      title: "Education Initiatives",
      description: "Support scholarships and educational programs for underprivileged children.",
    },
    {
      icon: <Users className="h-10 w-10 text-[#C8A97E]" />,
      title: "Community Development",
      description: "Help build infrastructure and improve living conditions in local communities.",
    },
    {
      icon: <Award className="h-10 w-10 text-[#C8A97E]" />,
      title: "Youth Empowerment",
      description: "Invest in programs that develop leadership skills in young people.",
    },
  ]

  const donationOptions = [
    { value: "50", label: "$50" },
    { value: "100", label: "$100" },
    { value: "250", label: "$250" },
    { value: "500", label: "$500" },
    { value: "1000", label: "$1,000" },
    { value: "custom", label: "Custom Amount" },
  ]

  const handleDonationAmountChange = (value) => {
    setDonationAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    alert("Thank you for your donation!")
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 mt-24">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-[#C8A97E] transition-colors">
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#C8A97E] font-medium">Donate</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Donation background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" variants={fadeInUp}>
              Make a <span className="text-[#C8A97E]">Difference</span> Today
            </motion.h1>
            <motion.p className="text-lg md:text-xl mb-8 text-gray-200" variants={fadeInUp}>
              Your generosity powers our mission to create lasting change in communities across Lagos and beyond.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white rounded-md px-8"
                onClick={() => {
                  const formElement = document.getElementById("donation-form")
                  formElement?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Donate Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-md px-8">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section ref={impactRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Impact</h2>
            <div className="w-20 h-1 bg-[#C8A97E] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how your donations are transforming lives and communities through our various initiatives.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {impactItems.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 bg-gray-50 p-4 rounded-full inline-block">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mt-16 bg-gray-50 p-8 rounded-lg border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <DollarSign className="h-10 w-10 text-[#C8A97E] mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">$1.2M+</h3>
                <p className="text-gray-600">Raised Last Year</p>
              </div>
              <div>
                <Users className="h-10 w-10 text-[#C8A97E] mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">25,000+</h3>
                <p className="text-gray-600">Lives Impacted</p>
              </div>
              <div>
                <Calendar className="h-10 w-10 text-[#C8A97E] mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">35+</h3>
                <p className="text-gray-600">Years of Service</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section id="donation-form" ref={formRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Make Your Donation</h2>
            <div className="w-20 h-1 bg-[#C8A97E] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your contribution, no matter the size, makes a significant impact on our ability to serve communities.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  <motion.div variants={staggerContainer} initial="hidden" animate={formInView ? "visible" : "hidden"}>
                    {/* Donation Type */}
                    <motion.div variants={fadeInUp} className="mb-8">
                      <Label className="text-lg font-medium mb-4 block">Donation Type</Label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="button"
                          variant={donationType === "one-off" ? "default" : "outline"}
                          className={`flex-1 py-6 ${donationType === "one-off" ? "bg-[#C8A97E] hover:bg-[#8A6D3B]" : "border-gray-300"}`}
                          onClick={() => setDonationType("one-off")}
                        >
                          <DollarSign className="mr-2 h-5 w-5" />
                          One-time Donation
                        </Button>
                        <Button
                          type="button"
                          variant={donationType === "recurring" ? "default" : "outline"}
                          className={`flex-1 py-6 ${donationType === "recurring" ? "bg-[#C8A97E] hover:bg-[#8A6D3B]" : "border-gray-300"}`}
                          onClick={() => setDonationType("recurring")}
                        >
                          <Calendar className="mr-2 h-5 w-5" />
                          Monthly Donation
                        </Button>
                      </div>
                    </motion.div>

                    {/* Donation Amount */}
                    <motion.div variants={fadeInUp} className="mb-8">
                      <Label className="text-lg font-medium mb-4 block">Donation Amount</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {donationOptions.slice(0, 5).map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={donationAmount === option.value ? "default" : "outline"}
                            className={`py-6 ${donationAmount === option.value ? "bg-[#C8A97E] hover:bg-[#8A6D3B]" : "border-gray-300"}`}
                            onClick={() => handleDonationAmountChange(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                        <Button
                          type="button"
                          variant={donationAmount === "custom" ? "default" : "outline"}
                          className={`py-6 ${donationAmount === "custom" ? "bg-[#C8A97E] hover:bg-[#8A6D3B]" : "border-gray-300"}`}
                          onClick={() => handleDonationAmountChange("custom")}
                        >
                          Custom Amount
                        </Button>
                      </div>

                      {donationAmount === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <Label htmlFor="custom-amount">Enter Custom Amount ($)</Label>
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                              id="custom-amount"
                              type="number"
                              min="1"
                              placeholder="Enter amount"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Personal Information */}
                    <motion.div variants={fadeInUp} className="mb-8">
                      <Label className="text-lg font-medium mb-4 block">Personal Information</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" className="mt-1" required />
                        </div>
                        <div>
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" className="mt-1" required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" className="mt-1" required />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" className="mt-1" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Recognition Wall Option */}
                    <motion.div variants={fadeInUp} className="mb-8">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="recognition"
                          checked={showRecognition}
                          onCheckedChange={(checked) => setShowRecognition(checked === true)}
                        />
                        <div>
                          <Label htmlFor="recognition" className="text-base font-medium cursor-pointer">
                            Include me on the donor recognition wall
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            Your name will be displayed on our donor recognition wall to acknowledge your generous
                            contribution.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Conditional Recognition Fields */}
                    {showRecognition && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <h3 className="text-lg font-medium mb-4">Recognition Preferences</h3>

                        <div className="mb-4">
                          <Label htmlFor="recognition-preference" className="mb-2 block">
                            What would you like to display on the recognition wall?
                          </Label>
                          <Select value={recognitionPreference} onValueChange={setRecognitionPreference}>
                            <SelectTrigger id="recognition-preference">
                              <SelectValue placeholder="Select display preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full">Donation Amount, User Details, and Comments</SelectItem>
                              <SelectItem value="partial">User Details and Comments only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="mb-4">
                          <Label htmlFor="display-name" className="mb-2 block">
                            Display Name (if different from above)
                          </Label>
                          <Input id="display-name" placeholder="How you want your name to appear" />
                          <p className="text-sm text-gray-500 mt-1">Leave blank to use your first and last name</p>
                        </div>

                        <div>
                          <Label htmlFor="recognition-message" className="mb-2 block">
                            Message (Optional)
                          </Label>
                          <Textarea
                            id="recognition-message"
                            placeholder="Add a personal message to display with your donation"
                            className="min-h-[100px]"
                          />
                          <p className="text-sm text-gray-500 mt-1">Maximum 200 characters</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Payment Information - Placeholder */}
                    <motion.div variants={fadeInUp} className="mb-8">
                      <Label className="text-lg font-medium mb-4 block">Payment Information</Label>
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-600">
                          Payment processing would be integrated here with a secure payment gateway.
                        </p>
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      variants={fadeInUp}
                      className="mt-8"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button type="submit" className="w-full py-6 text-lg bg-[#C8A97E] hover:bg-[#8A6D3B]">
                        Complete Donation
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recognition Wall Preview */}
      <section ref={recognitionRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={recognitionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Donor Recognition Wall</h2>
            <div className="w-20 h-1 bg-[#C8A97E] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join these generous donors who have made a lasting impact on our mission.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={recognitionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: "John & Sarah Williams",
                amount: "$1,000",
                message: "In honor of our parents who taught us the importance of giving back.",
                date: "March 15, 2023",
              },
              {
                name: "The Johnson Family Foundation",
                amount: "$5,000",
                message: "Supporting education initiatives for a brighter future.",
                date: "January 8, 2023",
              },
              {
                name: "Anonymous Donor",
                amount: "$250",
                message: "Every child deserves access to quality healthcare.",
                date: "April 22, 2023",
              },
              {
                name: "Michael Chen",
                amount: "$500",
                message: "Proud to support community development in Lagos.",
                date: "February 10, 2023",
              },
              {
                name: "Lagos Business Association",
                amount: "$2,500",
                message: "Investing in the future of our community.",
                date: "May 5, 2023",
              },
              {
                name: "Olivia & James Taylor",
                amount: "$750",
                message: "For a better tomorrow.",
                date: "March 30, 2023",
              },
            ].map((donor, index) => (
              <motion.div key={index} variants={fadeInUp} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{donor.name}</h3>
                  <span className="text-[#C8A97E] font-bold">{donor.amount}</span>
                </div>
                <p className="text-gray-600 italic mb-4">"{donor.message}"</p>
                <p className="text-sm text-gray-500">{donor.date}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={recognitionInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Button
              className="bg-[#C8A97E] hover:bg-[#8A6D3B]"
              onClick={() => {
                const formElement = document.getElementById("donation-form")
                formElement?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Add Your Name to Our Wall
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-[#C8A97E] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about donations and how they're used.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  Is my donation tax-deductible?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Yes, Eko Club International is a registered 501(c)(3) nonprofit organization, and all donations are
                  tax-deductible to the extent allowed by law. You will receive a tax receipt for your records.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  How is my donation used?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Your donation directly supports our programs and initiatives, including medical missions, educational
                  scholarships, community development projects, and emergency relief efforts. We maintain transparency
                  in our financial reporting, and you can view our annual reports on our website.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  Can I specify which project my donation supports?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Yes, you can designate your donation to support a specific initiative or project. Please include this
                  information in the comments section when making your donation, or contact us directly for larger
                  designated gifts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  How do I cancel or modify a recurring donation?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  You can cancel or modify your recurring donation at any time by logging into your donor account or by
                  contacting our donor services team at donations@ekoclub.org or calling (123) 456-7890.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  Can I donate in memory or honor of someone?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Absolutely. Memorial and tribute gifts are a meaningful way to honor someone special. You can indicate
                  this in the comments section of your donation form, and we can send a notification to the honoree or
                  their family if you provide their contact information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Alternative Ways to Support */}
      <section ref={alternativeRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={alternativeInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Other Ways to Support</h2>
            <div className="w-20 h-1 bg-[#C8A97E] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beyond financial contributions, there are many ways you can support our mission.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={alternativeInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Clock className="h-10 w-10 text-[#C8A97E]" />,
                title: "Volunteer Your Time",
                description: "Join us at events, help with administrative tasks, or lend your professional skills.",
              },
              {
                icon: <Briefcase className="h-10 w-10 text-[#C8A97E]" />,
                title: "Corporate Partnerships",
                description:
                  "Engage your company in meaningful social responsibility through sponsorships and partnerships.",
              },
              {
                icon: <Gift className="h-10 w-10 text-[#C8A97E]" />,
                title: "In-Kind Donations",
                description: "Donate goods, services, or equipment that support our programs and operations.",
              },
              {
                icon: <Star className="h-10 w-10 text-[#C8A97E]" />,
                title: "Become a Member",
                description: "Join Eko Club International and participate in our governance and decision-making.",
              },
              {
                icon: <Users className="h-10 w-10 text-[#C8A97E]" />,
                title: "Host a Fundraiser",
                description: "Organize your own event or campaign to raise funds and awareness for our cause.",
              },
              {
                icon: <HelpCircle className="h-10 w-10 text-[#C8A97E]" />,
                title: "Spread the Word",
                description: "Share our mission with your network and help us reach more supporters.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 bg-white p-4 rounded-full inline-block">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="link" className="text-[#C8A97E] p-0 flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Make a <span className="text-[#C8A97E]">Difference</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg mb-8 text-gray-300"
            >
              Your support enables us to continue our vital work in communities that need it most.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-[#C8A97E] hover:bg-[#8A6D3B] text-white rounded-md px-8"
                onClick={() => {
                  const formElement = document.getElementById("donation-form")
                  formElement?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Donate Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-md px-8">
                Contact Us
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
