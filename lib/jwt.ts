import { jwtVerify } from "jose"

export async function verifyJwtToken(token: string) {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret"))
    return verified.payload as any
  } catch (error) {
    throw new Error("Your token has expired.")
  }
}
