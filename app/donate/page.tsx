"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Heart, DollarSign, Users, Calendar, Award, CheckCircle } from "lucide-react"

export default function DonatePage() {
  // State for donation form
  const [donationType, setDonationType] = useState("one-off")
  const [donationAmount, setDonationAmount] = useState("100")
  const [customAmount, setCustomAmount] = useState("")
  const [showRecognition, setShowRecognition] = useState(false)
  const [recognitionPreference, setRecognitionPreference] = useState("full")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")

  // Refs for sections to observe
  const heroRef = useRef(null)
  const impactRef = useRef(null)
  const donateRef = useRef(null)
  const recognitionRef = useRef(null)
  const faqRef = useRef(null)

  // State for section visibility
  const [heroVisible, setHeroVisible] = useState(false)
  const [impactVisible, setImpactVisible] = useState(false)
  const [donateVisible, setDonateVisible] = useState(false)
  const [recognitionVisible, setRecognitionVisible] = useState(false)
  const [faqVisible, setFaqVisible] = useState(false)

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current) {
            setHeroVisible(entry.isIntersecting)
          } else if (entry.target === impactRef.current) {
            setImpactVisible(entry.isIntersecting)
          } else if (entry.target === donateRef.current) {
            setDonateVisible(entry.isIntersecting)
          } else if (entry.target === recognitionRef.current) {
            setRecognitionVisible(entry.isIntersecting)
          } else if (entry.target === faqRef.current) {
            setFaqVisible(entry.isIntersecting)
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observe all section refs
    if (heroRef.current) observer.observe(heroRef.current)
    if (impactRef.current) observer.observe(impactRef.current)
    if (donateRef.current) observer.observe(donateRef.current)
    if (recognitionRef.current) observer.observe(recognitionRef.current)
    if (faqRef.current) observer.observe(faqRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (impactRef.current) observer.unobserve(impactRef.current)
      if (donateRef.current) observer.unobserve(donateRef.current)
      if (recognitionRef.current) observer.unobserve(recognitionRef.current)
      if (faqRef.current) observer.unobserve(faqRef.current)
    }
  }, [])

  // Handle donation amount selection
  const handleAmountSelect = (amount) => {
    setDonationAmount(amount)
    setCustomAmount("")
  }

  // Handle custom amount input
  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setDonationAmount("custom")
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    // Process donation (would connect to payment processor in production)
    alert("Thank you for your donation! This would connect to a payment processor in production.")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb with proper spacing to avoid navbar overlap */}
      <div className="bg-white shadow-sm pt-24 pb-4">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/donate">Donate</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-[#8A6D3B]/90 to-[#C8A97E]/90 py-20 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="h-full w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Our Cause</h1>
            <p className="text-lg md:text-xl mb-8">
              Your generous donation helps us make a lasting impact in our communities. Together, we can create positive
              change and build a better future.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-white text-[#8A6D3B] hover:bg-gray-100 hover:text-[#C8A97E] font-semibold text-lg px-8"
                onClick={() => donateRef.current.scrollIntoView({ behavior: "smooth" })}
              >
                Donate Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section ref={impactRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={impactVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Donation Makes a Difference</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how your contributions help us create meaningful change in our communities and support vital
              initiatives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="h-10 w-10 text-[#C8A97E]" />,
                title: "Medical Missions",
                description: "Providing essential healthcare services to underserved communities in Lagos.",
                stat: "5,000+",
                statLabel: "People Served",
              },
              {
                icon: <Users className="h-10 w-10 text-[#C8A97E]" />,
                title: "Educational Support",
                description: "Funding scholarships and educational resources for students in need.",
                stat: "250+",
                statLabel: "Scholarships Awarded",
              },
              {
                icon: <DollarSign className="h-10 w-10 text-[#C8A97E]" />,
                title: "Community Development",
                description: "Building infrastructure and supporting local initiatives.",
                stat: "12",
                statLabel: "Projects Completed",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={impactVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center h-full">
                    <div className="mb-4 p-3 bg-[#C8A97E]/10 rounded-full">{item.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                    <div className="mt-auto">
                      <p className="text-3xl font-bold text-[#8A6D3B]">{item.stat}</p>
                      <p className="text-sm text-gray-500">{item.statLabel}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section ref={donateRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={donateVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Make Your Donation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your support enables us to continue our mission of service and community development.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={donateVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Donation Type */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Donation Type</Label>
                      <Tabs value={donationType} onValueChange={setDonationType} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="one-off">One-off Donation</TabsTrigger>
                          <TabsTrigger value="recurring">Monthly Recurring</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Donation Amount */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Donation Amount</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {["50", "100", "250", "500"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={donationAmount === amount ? "default" : "outline"}
                            className={donationAmount === amount ? "bg-[#C8A97E] hover:bg-[#8A6D3B]" : ""}
                            onClick={() => handleAmountSelect(amount)}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="customAmount">Custom Amount:</Label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="customAmount"
                            type="number"
                            min="1"
                            placeholder="Enter amount"
                            className="pl-8"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recognition Wall Option */}
                    <div className="flex items-start space-x-2">
                      <Checkbox id="recognitionWall" checked={showRecognition} onCheckedChange={setShowRecognition} />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="recognitionWall"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Add me to the donor recognition wall
                        </Label>
                        <p className="text-sm text-gray-500">
                          Your name will be displayed on our donor recognition wall to acknowledge your support.
                        </p>
                      </div>
                    </div>

                    {/* Conditional Fields for Recognition Wall */}
                    {showRecognition && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 border-t border-b py-4 border-gray-200"
                      >
                        <div>
                          <Label htmlFor="recognitionPreference">Display Preference</Label>
                          <Select value={recognitionPreference} onValueChange={setRecognitionPreference}>
                            <SelectTrigger className="mt-1.5">
                              <SelectValue placeholder="Select display preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full">Donation Amount + User Details + Comments</SelectItem>
                              <SelectItem value="partial">User Details + Comments only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              placeholder="Enter your full name"
                              className="mt-1.5"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required={showRecognition}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              className="mt-1.5"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required={showRecognition}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="comment">Comment (Optional)</Label>
                          <Textarea
                            id="comment"
                            placeholder="Share why you're supporting our cause..."
                            className="mt-1.5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B] text-lg py-6">
                        Donate ${donationAmount === "custom" ? customAmount || "0" : donationAmount}
                        {donationType === "recurring" && " Monthly"}
                      </Button>
                    </motion.div>

                    <p className="text-center text-sm text-gray-500">
                      Secure payment processing. Your information is protected.
                    </p>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recognition Wall Section */}
      <section ref={recognitionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={recognitionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Generous Supporters</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are grateful to these individuals and organizations who have supported our mission.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "John & Sarah Williams",
                amount: "$1,000",
                comment: "In honor of our parents who taught us the importance of giving back to the community.",
                date: "November 2023",
              },
              {
                name: "Lagos Business Association",
                amount: "$5,000",
                comment: "Proud to support the educational initiatives that empower the next generation.",
                date: "October 2023",
              },
              {
                name: "The Thompson Family",
                amount: "$750",
                comment: "We believe in the work you're doing for healthcare access.",
                date: "September 2023",
              },
              {
                name: "Anonymous Donor",
                amount: "$2,500",
                comment: "Keep up the excellent work in the community!",
                date: "August 2023",
              },
              {
                name: "Global Nigerian Professionals",
                amount: "$3,000",
                comment: "Supporting our homeland from abroad with pride.",
                date: "July 2023",
              },
              {
                name: "Michael & Elizabeth Adeyemi",
                amount: "$1,200",
                comment: "For the youth empowerment programs that are changing lives.",
                date: "June 2023",
              },
            ].map((donor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={recognitionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Award className="h-5 w-5 text-[#C8A97E] mr-2" />
                      <p className="text-[#8A6D3B] font-medium">{donor.amount}</p>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{donor.name}</h3>
                    <p className="text-gray-600 text-sm italic mb-4">"{donor.comment}"</p>
                    <p className="text-xs text-gray-500">{donor.date}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={faqVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about donations and how they are used.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How are donations used?",
                  answer:
                    "Your donations directly fund our community projects including medical missions, educational scholarships, empowerment initiatives, and infrastructure development in Lagos and surrounding communities. We ensure that at least 85% of all donations go directly to program expenses.",
                },
                {
                  question: "Are donations tax-deductible?",
                  answer:
                    "Yes, Eko Club International is a registered 501(c)(3) nonprofit organization in the United States, and donations are tax-deductible to the extent allowed by law. We provide tax receipts for all donations.",
                },
                {
                  question: "Can I specify which project my donation supports?",
                  answer:
                    "When making your donation, you can indicate in the comments which specific initiative you'd like to support, such as medical missions, educational scholarships, or youth programs.",
                },
                {
                  question: "How do recurring donations work?",
                  answer:
                    "Recurring donations are processed automatically on the same day each month. You can cancel or modify your recurring donation at any time by contacting our donor support team.",
                },
                {
                  question: "Is my payment information secure?",
                  answer:
                    "Yes, we use industry-standard encryption and secure payment processors to ensure your financial information is protected. We never store your complete credit card information on our servers.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={faqVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Alternative Ways to Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Other Ways to Support</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beyond financial contributions, there are many ways you can support our mission.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="h-10 w-10 text-[#C8A97E]" />,
                title: "Volunteer Your Time",
                description: "Join us at events, help organize fundraisers, or contribute your professional skills.",
              },
              {
                icon: <Users className="h-10 w-10 text-[#C8A97E]" />,
                title: "Become a Member",
                description:
                  "Join Eko Club International and participate in our regular activities and decision-making.",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-[#C8A97E]" />,
                title: "Spread the Word",
                description: "Follow us on social media and help raise awareness about our initiatives.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + 0.1 * index }}
                className="text-center"
              >
                <div className="mb-4 mx-auto p-3 bg-[#C8A97E]/10 rounded-full inline-block">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
