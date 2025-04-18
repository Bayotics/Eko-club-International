"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, PauseCircle, PlayCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

interface Subscription {
  _id: string
  fullName: string
  email: string
  amount: number
  currency: string
  paymentMethod: string
  status: "active" | "paused" | "cancelled"
  lastBillingDate: string
  nextBillingDate: string
  createdAt: string
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/subscriptions")
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions")
      }
      const data = await response.json()
      setSubscriptions(data.subscriptions)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSubscriptionStatus = async (id: string, status: "active" | "paused" | "cancelled") => {
    setProcessingId(id)
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update subscription")
      }

      // Update the local state
      setSubscriptions(subscriptions.map((sub) => (sub._id === id ? { ...sub, status } : sub)))

      toast({
        title: "Success",
        description: `Subscription ${status === "active" ? "activated" : status === "paused" ? "paused" : "cancelled"} successfully`,
      })
    } catch (error) {
      console.error("Error updating subscription:", error)
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-500">Paused</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "paystack":
        return "Paystack"
      case "flutterwave":
        return "Flutterwave"
      case "paypal":
        return "PayPal"
      default:
        return method
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recurring Donations</CardTitle>
            <CardDescription>Manage recurring donation subscriptions</CardDescription>
          </div>
          <Button onClick={fetchSubscriptions} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recurring donations found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Billed</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription._id}>
                    <TableCell>
                      <div className="font-medium">{subscription.fullName}</div>
                      <div className="text-sm text-gray-500">{subscription.email}</div>
                    </TableCell>
                    <TableCell>
                      {subscription.currency} {subscription.amount}
                    </TableCell>
                    <TableCell>{getPaymentMethodLabel(subscription.paymentMethod)}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>{format(new Date(subscription.lastBillingDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {subscription.status === "active" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscriptionStatus(subscription._id, "paused")}
                            disabled={processingId === subscription._id}
                          >
                            {processingId === subscription._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <PauseCircle className="h-4 w-4 mr-1" />
                            )}
                            Pause
                          </Button>
                        ) : subscription.status === "paused" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscriptionStatus(subscription._id, "active")}
                            disabled={processingId === subscription._id}
                          >
                            {processingId === subscription._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <PlayCircle className="h-4 w-4 mr-1" />
                            )}
                            Activate
                          </Button>
                        ) : null}
                        {subscription.status !== "cancelled" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateSubscriptionStatus(subscription._id, "cancelled")}
                            disabled={processingId === subscription._id}
                          >
                            {processingId === subscription._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
