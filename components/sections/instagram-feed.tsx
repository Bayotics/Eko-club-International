"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Send, Bookmark, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

// Placeholder Instagram posts
const instagramPosts = [
  {
    id: 1,
    imageUrl: "/images/ig1.png?height=600&width=600",
    caption:
      "Celebrating our cultural heritage at the annual Eko Festival. Proud to see so many members representing our traditions with pride! #EkoClub #CulturalHeritage #LagosProud",
    likes: 245,
    comments: 32,
    date: "2 days ago",
  },
  {
    id: 2,
    imageUrl: "/images/ig2.png?height=600&width=600",
    caption:
      "Our medical mission team provided free healthcare services to over 500 people in Lagos last week. Making a difference one community at a time. #CommunityService #MedicalMission #EkoClubCares",
    likes: 312,
    comments: 45,
    date: "5 days ago",
  },
  {
    id: 3,
    imageUrl: "/images/ig3.png?height=600&width=600",
    caption:
      "Congratulations to all the scholarship recipients at our annual education gala! Your dedication to academic excellence inspires us all. #Education #Scholarships #FutureLeaders",
    likes: 189,
    comments: 27,
    date: "1 week ago",
  },
]

export default function InstagramFeed() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <span className="text-green-900">FEEDS</span> FROM OUR SOCIALS
              <Instagram className="h-8 w-8 text-[#E1306C] ml-2" />
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              asChild
              className="bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] hover:opacity-90 text-white rounded-full px-6"
            >
              <Link
                href="https://www.instagram.com/ekoclubinternational/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" />
                <span>Follow Us</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-3 flex items-center gap-2 border-b">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#FCAF45] to-[#E1306C] p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-[1px]">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png"
                      alt="Eko Club Logo"
                      width={30}
                      height={30}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">ekoclubinternational</p>
                </div>
              </div>

              <div className="aspect-square relative">
                <Image
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={`Instagram post ${post.id}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex gap-3">
                    <Heart className="h-6 w-6 hover:text-red-500 cursor-pointer transition-colors" />
                    <MessageCircle className="h-6 w-6 hover:text-blue-500 cursor-pointer transition-colors" />
                    <Send className="h-6 w-6 hover:text-blue-400 cursor-pointer transition-colors" />
                  </div>
                  <Bookmark className="h-6 w-6 hover:text-yellow-500 cursor-pointer transition-colors" />
                </div>

                <p className="text-sm font-semibold mb-1">{post.likes} likes</p>

                <div className="mb-2">
                  <span className="text-sm">
                    <span className="font-semibold">ekoclubinternational</span>{" "}
                    {post.caption.length > 120 ? `${post.caption.substring(0, 120)}...` : post.caption}
                  </span>
                  {post.caption.length > 120 && <button className="text-gray-500 text-sm ml-1">more</button>}
                </div>

                <p className="text-xs text-gray-500">View all {post.comments} comments</p>
                <p className="text-xs text-gray-400 mt-1">{post.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Button
            asChild
            variant="outline"
            className="border-[#153d0f] text-[#25611b] hover:bg-[#368b29] hover:text-white transition-colors duration-300 rounded-full px-8"
          >
            <Link href="https://www.instagram.com/ekoclubinternational/" target="_blank" rel="noopener noreferrer">
              View More on Instagram
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

// NEw code for when the instagram is setup
// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import Image from "next/image"
// import Link from "next/link"
// import { Heart, MessageCircle, Send, Bookmark, Instagram, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"

// // Define the Instagram post type
// interface InstagramPost {
//   id: string
//   imageUrl: string
//   caption: string
//   likes: number
//   comments: number
//   date: string
//   permalink: string
// }

// // Fallback posts in case API fails
// const fallbackPosts = [
//   {
//     id: "1",
//     imageUrl: "/placeholder.svg?height=600&width=600",
//     caption:
//       "Celebrating our cultural heritage at the annual Eko Festival. Proud to see so many members representing our traditions with pride! #EkoClub #CulturalHeritage #LagosProud",
//     likes: 245,
//     comments: 32,
//     date: "2 days ago",
//     permalink: "https://www.instagram.com/ekoclubinternational/",
//   },
//   {
//     id: "2",
//     imageUrl: "/placeholder.svg?height=600&width=600",
//     caption:
//       "Our medical mission team provided free healthcare services to over 500 people in Lagos last week. Making a difference one community at a time. #CommunityService #MedicalMission #EkoClubCares",
//     likes: 312,
//     comments: 45,
//     date: "5 days ago",
//     permalink: "https://www.instagram.com/ekoclubinternational/",
//   },
//   {
//     id: "3",
//     imageUrl: "/placeholder.svg?height=600&width=600",
//     caption:
//       "Congratulations to all the scholarship recipients at our annual education gala! Your dedication to academic excellence inspires us all. #Education #Scholarships #FutureLeaders",
//     likes: 189,
//     comments: 27,
//     date: "1 week ago",
//     permalink: "https://www.instagram.com/ekoclubinternational/",
//   },
// ]

// export default function InstagramFeed() {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [posts, setPosts] = useState<InstagramPost[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     setIsLoaded(true)
//     fetchInstagramPosts()

//     // Set up a refresh interval (every 10 minutes)
//     const refreshInterval = setInterval(fetchInstagramPosts, 10 * 60 * 1000)

//     return () => clearInterval(refreshInterval)
//   }, [])

//   const fetchInstagramPosts = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/instagram")

//       if (!response.ok) {
//         throw new Error("Failed to fetch Instagram posts")
//       }

//       const data = await response.json()

//       if (data.error) {
//         throw new Error(data.error)
//       }

//       if (data.posts && data.posts.length > 0) {
//         setPosts(data.posts)
//       } else {
//         // Use fallback if no posts returned
//         setPosts(fallbackPosts)
//       }
//     } catch (err) {
//       console.error("Error fetching Instagram posts:", err)
//       setError(err instanceof Error ? err.message : "Unknown error")
//       // Use fallback posts on error
//       setPosts(fallbackPosts)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <section className="py-16 md:py-24 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-12">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={isLoaded ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
//               <span className="text-[#C8A97E]">FEEDS</span> FROM OUR SOCIALS
//               <Instagram className="h-8 w-8 text-[#E1306C] ml-2" />
//             </h2>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={isLoaded ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <Button
//               asChild
//               className="bg-gradient-to-r from-[#405DE6] via-[#5B51D8] to-[#833AB4] hover:opacity-90 text-white rounded-full px-6"
//             >
//               <Link
//                 href="https://www.instagram.com/ekoclubinternational/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2"
//               >
//                 <Instagram className="h-4 w-4" />
//                 <span>Follow Us</span>
//               </Link>
//             </Button>
//           </motion.div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="h-8 w-8 text-[#C8A97E] animate-spin" />
//             <span className="ml-2 text-[#C8A97E]">Loading latest posts...</span>
//           </div>
//         ) : error ? (
//           <div className="text-center p-8 bg-red-50 rounded-lg text-red-500">
//             <p>Failed to load Instagram posts: {error}</p>
//             <Button onClick={fetchInstagramPosts} variant="outline" className="mt-4">
//               Try Again
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
//             {posts.map((post, index) => (
//               <motion.div
//                 key={post.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={isLoaded ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.5, delay: 0.1 * index }}
//                 className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
//               >
//                 <div className="p-3 flex items-center gap-2 border-b">
//                   <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#FCAF45] to-[#E1306C] p-[2px]">
//                     <div className="w-full h-full rounded-full overflow-hidden bg-white p-[1px]">
//                       <Image
//                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png"
//                         alt="Eko Club Logo"
//                         width={30}
//                         height={30}
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold">ekoclubinternational</p>
//                   </div>
//                 </div>

//                 <Link href={post.permalink} target="_blank" rel="noopener noreferrer">
//                   <div className="aspect-square relative">
//                     <Image
//                       src={post.imageUrl || "/placeholder.svg"}
//                       alt={`Instagram post ${post.id}`}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 </Link>

//                 <div className="p-4">
//                   <div className="flex justify-between mb-2">
//                     <div className="flex gap-3">
//                       <Heart className="h-6 w-6 hover:text-red-500 cursor-pointer transition-colors" />
//                       <MessageCircle className="h-6 w-6 hover:text-blue-500 cursor-pointer transition-colors" />
//                       <Send className="h-6 w-6 hover:text-blue-400 cursor-pointer transition-colors" />
//                     </div>
//                     <Bookmark className="h-6 w-6 hover:text-yellow-500 cursor-pointer transition-colors" />
//                   </div>

//                   <div className="mb-2">
//                     <span className="text-sm">
//                       <span className="font-semibold">ekoclubinternational</span>{" "}
//                       {post.caption.length > 120 ? `${post.caption.substring(0, 120)}...` : post.caption}
//                     </span>
//                     {post.caption.length > 120 && (
//                       <Link href={post.permalink} target="_blank" rel="noopener noreferrer">
//                         <button className="text-gray-500 text-sm ml-1">more</button>
//                       </Link>
//                     )}
//                   </div>

//                   <p className="text-xs text-gray-400 mt-1">{post.date}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={isLoaded ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6, delay: 0.6 }}
//           className="mt-10 text-center"
//         >
//           <Button
//             asChild
//             variant="outline"
//             className="border-[#C8A97E] text-[#C8A97E] hover:bg-[#C8A97E] hover:text-white transition-colors duration-300 rounded-full px-8"
//           >
//             <Link href="https://www.instagram.com/ekoclubinternational/" target="_blank" rel="noopener noreferrer">
//               View More on Instagram
//             </Link>
//           </Button>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

