import { NextResponse } from "next/server"

// Instagram API constants
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN

export async function GET() {
  try {
    // Check if we have the required environment variables
    if (!INSTAGRAM_ACCESS_TOKEN) {
      return NextResponse.json({ error: "Instagram access token not configured" }, { status: 500 })
    }

    // Fetch media from Instagram Graph API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=3&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("Instagram API error:", error)
      return NextResponse.json({ error: "Failed to fetch from Instagram API" }, { status: response.status })
    }

    const data = await response.json()

    // Transform the data to match our component's expected format
    const posts = data.data.map((post: any) => ({
      id: post.id,
      imageUrl: post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
      caption: post.caption || "",
      permalink: post.permalink,
      timestamp: post.timestamp,
      // We don't have access to likes and comments count with basic display API
      likes: 0,
      comments: 0,
      date: new Date(post.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching Instagram posts:", error)
    return NextResponse.json({ error: "Failed to fetch Instagram posts" }, { status: 500 })
  }
}
