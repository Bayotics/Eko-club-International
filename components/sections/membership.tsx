"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const membershipPlans = [
  {
    id: "regular",
    title: "Regular Membership",
    price: "$100",
    period: "annually",
    features: [
      "Access to all club events",
      "Voting rights in club elections",
      "Participation in community service projects",
      "Quarterly newsletter subscription",
      "Member directory listing",
    ],
    isPopular: false,
  },
  {
    id: "premium",
    title: "Premium Membership",
    price: "$250",
    period: "annually",
    features: [
      "All Regular Membership benefits",
      "Priority registration for events",
      "Exclusive networking opportunities",
      "Recognition in annual report",
      "Discounted tickets for guests",
      "Access to leadership development programs",
    ],
    isPopular: true,
  },
  {
    id: "lifetime",
    title: "Lifetime Membership",
    price: "$2,500",
    period: "one-time",
    features: [
      "All Premium Membership benefits",
      "Lifetime membership status",
      "Special recognition at annual gala",
      "Personalized membership plaque",
      "VIP access to all club events",
      "Mentorship opportunities",
    ],
    isPopular: false,
  },
]

export default function Membership() {
  return (
    <section id="membership" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light mb-4"
          >
            BECOME A <span className="text-[#C8A97E] font-medium">MEMBER</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-[#C8A97E] mx-auto mb-6"
          />
          <p className="text-gray-600 max-w-3xl mx-auto">
            Join our community of dedicated individuals committed to making a difference. Choose the membership plan
            that works best for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {membershipPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full flex flex-col ${plan.isPopular ? "border-[#C8A97E] shadow-xl" : "border-gray-200"}`}
              >
                {plan.isPopular && (
                  <div className="bg-[#C8A97E] text-white text-center py-1 text-sm font-medium">MOST POPULAR</div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl font-medium">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-0">
                  <div className="mb-6">
                    <span className="text-4xl font-light">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-[#C8A97E] mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-6 pb-8">
                  <Button
                    className={`w-full ${plan.isPopular ? "bg-[#C8A97E] hover:bg-[#8A6D3B] text-white" : "border-2 border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-black"} transition-colors duration-300 rounded-none uppercase py-6`}
                  >
                    Join Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

