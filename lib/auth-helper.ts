import type { User } from "@/models/user"

export function isPendingUser(user: User | null): boolean {
  return user?.role === "pending"
}

export function isBlockedUser(user: User | null): boolean {
  return user?.role === "blocked"
}

export function canAccessMemberFeatures(user: User | null): boolean {
  return user?.role === "member" || user?.role === "admin" || user?.role === "superadmin"
}
