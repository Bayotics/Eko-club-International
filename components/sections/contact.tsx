"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

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

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      {/* <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            CONTACT <span className="text-[#C8A97E] font-medium">US</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[#C8A97E] mx-auto mb-6"
          />
          <p className="text-gray-600 max-w-3xl mx-auto">
            Have questions or want to get involved? Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-medium">Get In Touch</h3>
            <p className="text-gray-600">
              We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#C8A97E] p-3 rounded-full text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Our Location</h4>
                  <p className="text-gray-600">123 Main Street, Atlanta, GA 30303</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#C8A97E] p-3 rounded-full text-black">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Phone Number</h4>
                  <p className="text-gray-600">267-444-0066</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#C8A97E] p-3 rounded-full text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Email Address</h4>
                  <p className="text-gray-600">info@ekoclubinternational.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#8A6D3B] p-3 rounded-full text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Office Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div
            // initial={{ opacity: 0, x: 50 }}
            // whileInView={{ opacity: 1, x: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] py-6"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] py-6"
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] py-6"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-[#C8A97E] focus:ring-[#C8A97E] min-h-[150px]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#C8A97E] hover:bg-[#8A6D3B] text-white transition-colors duration-300 rounded-none py-6 uppercase"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div> */}
    </section>
  )
}

