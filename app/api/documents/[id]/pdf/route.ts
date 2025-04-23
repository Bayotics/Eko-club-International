import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Document from "@/models/Document"
import { jwtVerify } from "jose"
import puppeteer from "puppeteer"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    let userRole = "public"

    if (token) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key"),
        )
        if (payload) {
          userRole = payload.role
        }
      } catch (error) {
        console.error("Error verifying token:", error)
      }
    }

    await connectToDatabase()
    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if the user has permission to access this document
    if (
      userRole === "admin" ||
      (userRole === "exco" && document.meantFor.includes("exco")) ||
      (userRole === "member" && document.meantFor.includes("member")) ||
      document.meantFor.includes("public")
    ) {
      // Launch a headless browser
      const browser = await puppeteer.launch({ headless: "new", waitUntil: "networkidle0" })
      const page = await browser.newPage()

      // Set content of the page
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${document.title}</title>
          <style>
            body { font-family: 'Arial', sans-serif; }
            h1 { font-size: 24px; }
            p { font-size: 12px; }
            .logo-container { text-align: center; margin-bottom: 20px; }
            .logo { max-width: 150px; height: auto; }
            .slogan { font-style: italic; color: #666; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .mt-20 { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="logo-container">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eko_club_logo-removebg-preview-SAUiEpYRjmONtSd1YKYL42qyW13AzD.png" alt="Eko Club Logo" class="logo">
            <p class="slogan">Together We Can Make A Difference!</p>
          </div>
          <h1 class = "text-center font-bold">${document.title}</h1>
          <p class = "text-center font-semibold">${document.description}</p>
          <div class = "mt-20">${document.content}</div>
        </body>
        </html>
      `)
 

      // Generate PDF
      const pdfBuffer = await page.pdf({ format: "A4" })

      // Close the browser
      await browser.close()

      // Set response headers
      const headers = {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${document.title.replace(/\s+/g, "_")}.pdf"`,
        "Transfer-Encoding": "chunked",
      }

      // Return PDF as response
      return new NextResponse(pdfBuffer, { headers })
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
