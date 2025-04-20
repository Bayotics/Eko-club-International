"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Calendar, Award, Briefcase, Mail, Phone } from "lucide-react"
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Sample data for current president
const currentPresident = {
  name: "Honorable Saheed Olushi",
  title: "Current President",
  image: "/images/president.jpg",
  joinedYear: "2005",
  presidentYear: "2021",
  term: "2021 - Present",
  email: "president@ekoclubinternational.org",
  phone: "+1 (234) 567-8901",
  contributions: [
    "Led the expansion of the club's international chapters from 12 to 22",
    "Initiated the annual medical mission program that has served over 25,000 people",
    "Established the Eko Club International Scholarship Fund which has supported over 500 students",
    "Modernized the club's operations through digital transformation initiatives",
    "Strengthened partnerships with government agencies and international organizations",
  ],
  biography:
    "Honorable Saheed Olushi is a distinguished leader with over 25 years of experience in community service and organizational leadership. He holds a Master's degree in Public Administration and has dedicated his career to promoting cultural heritage and community development. Under his leadership, Eko Club International has experienced unprecedented growth and impact, expanding its reach globally while strengthening its core mission of preserving Lagos cultural heritage and supporting community development initiatives.",
}

const currentExcos = [
  {
    name: "Hon. Olajide Danmola",
    title: "Vice President",
    image: "/images/Excos/vice-president.PNG",
    bio: "Hon. Olajide Danmola is a respected politician and community leader with over 20 years of experience in healthcare administration. He leads the club's medical mission initiatives.",
    social: {
      facebook: "https://facebook.com/adebayo",
      twitter: "https://twitter.com/adebayo",
      instagram: "https://instagram.com/adebayo",
      linkedin: "https://linkedin.com/in/adebayo",
    },
  },
  {
    name: "Hon. Ogbara-Alagba",
    title: "General Secretary",
    image: "/images/Excos/gen-sec.PNG",
    bio: "Hon. Lola Ogbara-Alogba is a corporate lawyer with expertise in governance and compliance. He manages the club's administrative affairs and ensures operational excellence.",
    social: {
      facebook: "https://facebook.com/folake",
      twitter: "https://twitter.com/folake",
      instagram: "https://instagram.com/folake",
      linkedin: "https://linkedin.com/in/folake",
    },
  },
  {
    name: "Hon. Omotayo Ogunyemi",
    title: "Assistant Gen. Secretary",
    image: "/images/Excos/Asst-Gen-sec.PNG",
    bio: "Hon. Omotayo Ogunyemi is a certified accountant with over 15 years of experience in financial management. He oversees the club's financial operations and reporting.",
    social: {
      facebook: "https://facebook.com/tunde",
      twitter: "https://twitter.com/tunde",
      instagram: "https://instagram.com/tunde",
      linkedin: "https://linkedin.com/in/tunde",
    },
  },
  {
    name: "Hon. Olabisi Rokosu-Lawal",
    title: "Social Secretary",
    image: "/images/Excos/soc-secretary.PNG",
    bio: "Hon. Olabisi is a social worker with a passion for community development. She coordinates the club's welfare programs and community outreach initiatives.",
    social: {
      facebook: "https://facebook.com/funmilayo",
      twitter: "https://twitter.com/funmilayo",
      instagram: "https://instagram.com/funmilayo",
      linkedin: "https://linkedin.com/in/funmilayo",
    },
  },
  {
    name: "Hon. Bukky Adebiyi",
    title: "Chief Whip",
    image: "/images/Excos/chief-whip.PNG",
    bio: "Hon. Bukky Adebiyi is a cultural enthusiast and historian. She leads the club's cultural preservation initiatives and organizes cultural events and exhibitions.",
    social: {
      facebook: "https://facebook.com/kunle",
      twitter: "https://twitter.com/kunle",
      instagram: "https://instagram.com/kunle",
      linkedin: "https://linkedin.com/in/kunle",
    },
  },
  {
    name: "Hon. Saheed Abdullateef",
    title: "Public Relations Officer",
    image: "/images/Excos/pro.PNG",
    bio: "Hon. Saheed is a communications expert with experience in public relations and media management. He manages the club's public image and external communications.",
    social: {
      facebook: "https://facebook.com/bisi",
      twitter: "https://twitter.com/bisi",
      instagram: "https://instagram.com/bisi",
      linkedin: "https://linkedin.com/in/bisi",
    },
  },
  {
    name: "Ibiyinka Thanni",
    title: "Financial Secretary",
    image: "/images/Excos/fin-sec.PNG",
    bio: "Hon. Ibiyinka is responsible for maintaining accurate financial records and supporting the treasurer in all monetary matters. His commitment to detail and transparency strengthens the club's financial operations.",
    social: {
      facebook: "https://facebook.com/bisi",
      twitter: "https://twitter.com/bisi",
      instagram: "https://instagram.com/bisi",
      linkedin: "https://linkedin.com/in/bisi",
    },
  },
  {
    name: "Hon. Olatunji Anthonio",
    title: "Auditor General",
    image: "/images/Excos/treasurer.PNG",
    bio: "Hon. Olatunji oversees the financial assets of Eko Club International, ensuring transparent and accountable management of the club’s funds. ",
    social: {
      facebook: "https://facebook.com/bisi",
      twitter: "https://twitter.com/bisi",
      instagram: "https://instagram.com/bisi",
      linkedin: "https://linkedin.com/in/bisi",
    },
  },
  // {
  //   name: "Hon. Saheed Abdullateef",
  //   title: "Public Relations Officer",
  //   image: "/images/Excos/pro.PNG",
  //   bio: "Hon. Saheed is a communications expert with experience in public relations and media management. He manages the club's public image and external communications.",
  //   social: {
  //     facebook: "https://facebook.com/bisi",
  //     twitter: "https://twitter.com/bisi",
  //     instagram: "https://instagram.com/bisi",
  //     linkedin: "https://linkedin.com/in/bisi",
  //   },
  // },
  
]

// Sample data for past presidents
const pastPresidents = [
  {
    name: "President Larry Ojo",
    term: "2017-2021",
    image: "/images/Presidents/larry-ojo.jpg",
    shortBio:
      "Led the club through a period of significant growth and expansion, establishing new chapters in Europe and North America...",
    fullBio:
      "President Lanre led the club through a period of significant growth and expansion, establishing new chapters in Europe and North America. During his tenure, the club's membership grew by 40%, and he initiated several landmark projects, including the Lagos Heritage Preservation Initiative and the Annual Medical Mission. President Ojo also strengthened the club's financial position through strategic partnerships and fundraising initiatives. His leadership was characterized by innovation, inclusivity, and a strong commitment to the club's core values. Prior to his presidency, he served as the club's Vice President and Welfare Officer, demonstrating his dedication to the organization's mission and vision. Chief Babatunde is a respected business leader with interests in real estate and hospitality.",
  },
  {
    name: "President Bissy Gaji",
    term: "2013-2017",
    image: "/images/Presidents/bissy.jpg",
    shortBio:
      "Focused on strengthening the club's governance structures and establishing a robust financial management system...",
    fullBio:
      "Chief Bissy Gaji focused on strengthening the club's governance structures and establishing a robust financial management system during his presidency. He implemented a comprehensive strategic plan that guided the club's activities and ensured alignment with its mission and vision. Under his leadership, the club launched the Eko Club International Scholarship Program, which has supported hundreds of students in their educational pursuits. Chief Gaji also initiated the club's digital transformation journey, introducing modern technologies to enhance communication and collaboration among members. His presidency was marked by transparency, accountability, and a strong emphasis on member engagement. Before becoming president, Chief Gaji served as the club's Financial Secretary and General Secretary, bringing valuable administrative experience to his leadership role. He is a chartered accountant and financial consultant with over 30 years of experience in the banking sector.",
  },
  {
    name: "President Zainudeen Popoola",
    term: "2009-2013",
    image: "/images/Presidents/zainu2.jpg",
    shortBio:
      "Championed the club's community development initiatives, with a particular focus on healthcare and education...",
    fullBio:
      "President Zainudeen championed the club's community development initiatives, with a particular focus on healthcare and education during his tenure as president. He established the Eko Club International Community Health Program, which provides free medical services to underserved communities in Lagos. Mr. Zainudeen also expanded the club's educational support initiatives, including the establishment of a vocational training center for youth empowerment. His presidency was characterized by a strong commitment to social responsibility and community service. Under his leadership, the club formed strategic partnerships with international organizations to enhance the impact of its development projects. Before his presidency, Mr. Zainudeen served as the club's Welfare Officer and Public Relations Officer, demonstrating his passion for community service and effective communication. He is a medical doctor with specialization in public health and has worked with several international health organizations.",
  },
  {
    name: "President T.J. Abass",
    term: "2005-2009",
    image: "/images/Presidents/tjAbass.jpeg",
    shortBio:
      "Prioritized cultural preservation and promotion, organizing cultural festivals and exhibitions that showcased Lagos heritage...",
    fullBio:
      "President Abass prioritized cultural preservation and promotion during his presidency, organizing cultural festivals and exhibitions that showcased Lagos heritage. He established the Lagos Cultural Heritage Documentation Project, which has preserved valuable cultural artifacts, traditions, and historical records. Chief Abass also strengthened the club's international presence by establishing new chapters in the United Kingdom and Canada. His leadership was marked by a deep appreciation for cultural identity and a commitment to passing on Lagos traditions to future generations. Under his guidance, the club developed educational materials on Lagos history and culture for use in schools and community centers. Prior to his presidency, Chief Abass served as the club's Cultural Secretary and Vice President, bringing a wealth of knowledge about Lagos cultural heritage to his leadership role. He is a cultural anthropologist and has authored several books on Lagos history and traditions.",
  },
  {
    name: "President O.J Lawal",
    term: "2003-2005",
    image: "/images/Presidents/OJLawal.jpg",
    shortBio:
      "Focused on membership growth and engagement, implementing programs that attracted younger members and increased participation...",
    fullBio:
      "Dr. Lawal focused on membership growth and engagement during his presidency, implementing programs that attracted younger members and increased participation in club activities. He introduced the Eko Club International Youth Forum, which provides mentorship and leadership development opportunities for young members. Dr. Lawal also modernized the club's communication channels, launching the first club website and regular newsletter. His presidency was characterized by innovation, inclusivity, and a forward-thinking approach to club management. Under his leadership, the club experienced a 30% increase in membership and established new chapters in three additional cities. Before becoming president, Dr. Lawal served as the club's Membership Secretary and Public Relations Officer, bringing valuable experience in member recruitment and engagement. He is an educational administrator and has held leadership positions in several academic institutions.",
  },
  {
    name: "Late Olusesi Dawodu",
    term: "2001-2003",
    image: "/images/Presidents/Late-dawodu1.jpg",
    shortBio:
      "As the founding president, established the club's foundational structures, values, and mission that continue to guide the organization...",
    fullBio:
      "President Olusesi, as the founding president, established the club's foundational structures, values, and mission that continue to guide the organization today. He brought together Lagos indigenes from various backgrounds and professions to form a cohesive community dedicated to cultural preservation and community development. President Olusesi drafted the club's first constitution and established its governance framework, ensuring a solid foundation for future growth. His visionary leadership set the club on a path of excellence and impact that has endured for decades. Under his guidance, the club launched its first community development project, a primary healthcare center in a rural community in Lagos State. President Olusesi's presidency was marked by vision, dedication, and a pioneering spirit. He is a respected community leader and businessman with interests in various sectors of the economy. His legacy as the founding president continues to inspire current and future generations of club members.",
  },
]

export default function LeadershipPage() {
  const [selectedPresident, setSelectedPresident] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentExcoIndex, setCurrentExcoIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
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

  const fadeInFromLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const fadeInFromRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    }),
  }

  const openModal = (president) => {
    setSelectedPresident(president)
    setModalOpen(true)
  }

  const handlePrevExco = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(-1)
    setCurrentExcoIndex((prev) => (prev === 0 ? currentExcos.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNextExco = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(1)
    setCurrentExcoIndex((prev) => (prev === currentExcos.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Display two executives at a time
  const getVisibleExcos = () => {
    const firstIndex = currentExcoIndex
    const secondIndex = (currentExcoIndex + 1) % currentExcos.length
    return [currentExcos[firstIndex], currentExcos[secondIndex]]
  }

  return (
    <div className="pt-24 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/why-join-us-home.jpg" alt="Eko Club Leadership" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="mb-4">
              <div className="flex items-center justify-center gap-2 text-white/80 mb-4">
                <Link href="/" className="hover:text-[#C8A97E] transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/#about" className="hover:text-[#C8A97E] transition-colors">
                  About
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[#C8A97E]">Leadership</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Our Leadership</h1>
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="h-1 w-24 bg-[#C8A97E] mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Meet the dedicated individuals who lead Eko Club International, guiding our mission and vision with
                passion and commitment.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Current President Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Current <span className="text-[#C8A97E]">President</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Under the visionary leadership of our current president, Eko Club International continues to grow and make
              a significant impact in our communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromLeft}
            >
              <div className="relative h-[600px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={currentPresident.image || "/placeholder.svg"}
                  alt={currentPresident.name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInFromRight}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-gray-800">{currentPresident.name}</h3>
              <p className="text-xl text-[#C8A97E] font-medium">{currentPresident.title}</p>
              <p className="text-gray-600">{currentPresident.biography}</p>

              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Joined Club:</span> {currentPresident.joinedYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">President Since:</span> {currentPresident.presidentYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Term:</span> {currentPresident.term}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {currentPresident.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#C8A97E]/10 text-[#C8A97E]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {currentPresident.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Key Contributions</h4>
                <ul className="space-y-2">
                  {currentPresident.contributions.map((contribution, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#C8A97E] font-bold">•</span>
                      <span className="text-gray-600">{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Executives Section - New Design */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Current <span className="text-[#C8A97E]">Executives</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              Our dedicated team of executives works tirelessly to fulfill the mission and vision of Eko Club
              International, bringing diverse skills and expertise to their roles.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentExcoIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20"
              >
                {getVisibleExcos().map((exco, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/2 aspect-square relative rounded-md overflow-hidden">
                      <Image src={exco.image || "/placeholder.svg"} alt={exco.name} fill className="object-cover" />
                    </div>
                    <div className="w-full md:w-1/2">
                      <h3 className="text-2xl font-bold text-gray-800">{exco.name}</h3>
                      <p className="text-[#C8A97E] mb-4">{exco.title}</p>
                      <div className="w-full h-px bg-gray-200 mb-4"></div>
                      <p className="text-gray-600 mb-6">{exco.bio}</p>

                      <div className="flex gap-4">
                        <a
                          href={exco.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#1DA1F2] text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                        >
                          <FaTwitter size={18} />
                        </a>
                        <a
                          href={exco.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#E1306C] text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                        >
                          <FaInstagram size={18} />
                        </a>
                        <a
                          href={exco.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0077B5] text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center items-center mt-16 gap-4">
              <button
                onClick={handlePrevExco}
                className="p-2 rounded-full border border-gray-300 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors"
                disabled={isAnimating}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">{currentExcoIndex + 1}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">{currentExcos.length}</span>
              </div>

              <button
                onClick={handleNextExco}
                className="p-2 rounded-full border border-gray-300 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors"
                disabled={isAnimating}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Past Presidents Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Past <span className="text-[#C8A97E]">Presidents</span>
            </h2>
            <div className="h-1 w-20 bg-[#C8A97E] mx-auto mb-8"></div>
            <p className="text-gray-600">
              We honor the legacy of our past presidents who have shaped Eko Club International through their visionary
              leadership and dedication to our mission.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {pastPresidents.map((president, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-80">
                  <Image
                    src={president.image || "/placeholder.svg"}
                    alt={president.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{president.name}</h3>
                  <p className="text-[#C8A97E] font-medium mb-4">{president.term}</p>
                  <p className="text-gray-600 mb-4">{president.shortBio}</p>

                  <Button
                    variant="link"
                    className="text-[#C8A97E] p-0 hover:text-[#8A6D3B]"
                    onClick={() => openModal(president)}
                  >
                    See more
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Biography Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
          {selectedPresident && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedPresident.name}</DialogTitle>
                <DialogDescription className="text-[#C8A97E] font-medium">{selectedPresident.term}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="relative h-40 md:h-full rounded-md overflow-hidden">
                  <Image
                    src={selectedPresident.image || "/placeholder.svg"}
                    alt={selectedPresident.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600">{selectedPresident.fullBio}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-[#C8A97E]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join Our Leadership Journey</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-10">
              Become a member of Eko Club International and be part of our leadership journey. Together, we can make a
              lasting impact in our communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#C8A97E] hover:bg-gray-100 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/#membership">Become a Member</Link>
              </Button>
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-none" asChild>
                <Link href="/donate">Support Our Cause</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

