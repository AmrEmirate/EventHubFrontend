"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CreditCard, Clock, Tag, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

// Define the structure of the ticket types
interface TicketType {
  id: any;
  name: string;
  price: number;
  description: string;
}

// Define the structure for the event and other related data
interface Event {
  id: any;
  title: string;
  date: string;
  location: string;
  image: string;
  ticketTypes: TicketType[];
}

export default function CheckoutPage() {
  const params = useParams()
  const [timeLeft, setTimeLeft] = useState<number>(7200) // 2 hours in seconds
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({
    regular: 1,
    vip: 0,
  })
  const [promoCode, setPromoCode] = useState<string>("")
  const [usePoints, setUsePoints] = useState<boolean>(false)
  const [pointsToUse, setPointsToUse] = useState<number>(0)

  // Mock data for the event
  const event: Event = {
    id: params.id,
    title: "Tech Conference 2024",
    date: "March 15, 2024",
    location: "Jakarta Convention Center",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop",
    ticketTypes: [
      {
        id: "regular",
        name: "Regular Ticket",
        price: 500000,
        description: "Access to all sessions and networking lunch",
      },
      {
        id: "vip",
        name: "VIP Ticket",
        price: 750000,
        description: "All regular benefits plus VIP seating and exclusive networking session",
      },
    ],
  }

  const userPoints = 25000
  const appliedPromo = promoCode === "EARLYBIRD20" ? { discount: 20, type: "percentage" } : null

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateSubtotal = () => {
    return event.ticketTypes.reduce((total, ticket) => {
      return total + ticket.price * selectedTickets[ticket.id as keyof typeof selectedTickets]
    }, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    let discount = 0

    if (appliedPromo) {
      if (appliedPromo.type === "percentage") {
        discount += subtotal * (appliedPromo.discount / 100)
      }
    }

    if (usePoints) {
      discount += pointsToUse
    }

    return discount
  }

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount()
  }

  const handleTicketChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, quantity),
    }))
  }

  const handlePointsChange = (points: number) => {
    const maxPoints = Math.min(userPoints, calculateSubtotal())
    setPointsToUse(Math.max(0, Math.min(points, maxPoints)))
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              <span className="text-sm">remaining to complete payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details & Ticket Selection */}
            <div className="space-y-6">
              {/* Event Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 mb-4">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-1">{event.date}</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{ticket.name}</h4>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        <p className="font-bold text-lg">{formatPrice(ticket.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleTicketChange(
                              ticket.id,
                              selectedTickets[ticket.id as keyof typeof selectedTickets] - 1,
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">
                          {selectedTickets[ticket.id as keyof typeof selectedTickets]}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleTicketChange(
                              ticket.id,
                              selectedTickets[ticket.id as keyof typeof selectedTickets] + 1,
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-700">✓ Promo code applied! {appliedPromo.discount}% discount</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    Use Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox
                      id="usePoints"
                      checked={usePoints}
                      onCheckedChange={(checked) => {
                        setUsePoints(checked as boolean)
                        if (!checked) setPointsToUse(0)
                      }}
                    />
                    <Label htmlFor="usePoints">Use my points (Available: {formatPrice(userPoints)})</Label>
                  </div>
                  {usePoints && (
                    <div className="space-y-2">
                      <Label htmlFor="pointsAmount">Points to use</Label>
                      <Input
                        id="pointsAmount"
                        type="number"
                        min="0"
                        max={Math.min(userPoints, calculateSubtotal())}
                        value={pointsToUse}
                        onChange={(e) => handlePointsChange(Number.parseInt(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum: {formatPrice(Math.min(userPoints, calculateSubtotal()))}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.ticketTypes.map((ticket) => {
                    const quantity = selectedTickets[ticket.id as keyof typeof selectedTickets]
                    if (quantity === 0) return null

                    return (
                      <div key={ticket.id} className="flex justify-between">
                        <span>
                          {ticket.name} x {quantity}
                        </span>
                        <span>{formatPrice(ticket.price * quantity)}</span>
                      </div>
                    )
                  })}

                  <Separator />

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount ({appliedPromo.discount}%)</span>
                      <span>-{formatPrice(calculateSubtotal() * (appliedPromo.discount / 100))}</span>
                    </div>
                  )}

                  {usePoints && pointsToUse > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Points Discount</span>
                      <span>-{formatPrice(pointsToUse)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="bank-transfer">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="e-wallet" id="e-wallet" />
                      <Label htmlFor="e-wallet">E-Wallet (GoPay, OVO, DANA)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">Credit/Debit Card</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Attendee Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendee Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" disabled={calculateTotal() <= 0 || timeLeft === 0}>
                  Proceed to Payment - {formatPrice(calculateTotal())}
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Save for Later
                </Button>
              </div>

              {/* Terms */}
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  By proceeding with this purchase, you agree to our{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
                <p>You will receive a confirmation email with your ticket details after payment is confirmed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
