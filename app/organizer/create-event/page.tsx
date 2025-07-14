"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, DollarSign, Tag, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// Define the structure of ticket type
interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

// Define the structure for promotions
interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  code: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
}

// Define the structure for the formData and related state
interface FormData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  fullAddress: string;
  isFree: boolean;
  totalSeats: number;
  image: File | null;
}

export default function CreateEventPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    fullAddress: "",
    isFree: false,
    totalSeats: 0,
    image: null,
  })

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: "1",
      name: "Regular Ticket",
      price: 0,
      description: "",
      quantity: 0,
    },
  ])

  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [showPromotionForm, setShowPromotionForm] = useState<boolean>(false)
  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, "id">>({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    code: "",
    startDate: "",
    endDate: "",
    usageLimit: 100,
  })

  const categories = [
    "Technology",
    "Business",
    "Education",
    "Arts",
    "Music",
    "Sports",
    "Health",
    "Food",
    "Travel",
    "Other",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTicketType = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      description: "",
      quantity: 0,
    }
    setTicketTypes((prev) => [...prev, newTicket])
  }

  const updateTicketType = (id: string, field: string, value: any) => {
    setTicketTypes((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, [field]: value } : ticket)))
  }

  const removeTicketType = (id: string) => {
    if (ticketTypes.length > 1) {
      setTicketTypes((prev) => prev.filter((ticket) => ticket.id !== id))
    }
  }

  const generatePromoCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setNewPromotion((prev) => ({ ...prev, code }))
  }

  const addPromotion = () => {
    if (newPromotion.title && newPromotion.code) {
      const promotion: Promotion = {
        ...newPromotion,
        id: Date.now().toString(),
      }
      setPromotions((prev) => [...prev, promotion])
      setNewPromotion({
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        code: "",
        startDate: "",
        endDate: "",
        usageLimit: 100,
      })
      setShowPromotionForm(false)
    }
  }

  const removePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    if (!formData.isFree && ticketTypes.every((ticket) => ticket.price === 0)) {
      alert("Please set ticket prices for paid events")
      return
    }

    // Create event logic here
    console.log("Creating event:", {
      ...formData,
      ticketTypes,
      promotions,
    })

    // Redirect to dashboard
    router.push("/organizer/dashboard")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Create New Event</h1>
              <p className="text-muted-foreground">Fill in the details to create your event</p>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="totalSeats">Total Seats</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    placeholder="Enter total seats"
                    value={formData.totalSeats}
                    onChange={(e) => handleInputChange("totalSeats", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your event"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="longDescription">Detailed Description</Label>
                <Textarea
                  id="longDescription"
                  placeholder="Detailed description, agenda, what attendees can expect..."
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange("longDescription", e.target.value)}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("image", e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a high-quality image (recommended: 1200x600px)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Date & Time
              </CardTitle>
              <CardDescription>When will your event take place?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </CardTitle>
              <CardDescription>Where will your event be held?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Venue Name *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Jakarta Convention Center"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullAddress">Full Address</Label>
                <Textarea
                  id="fullAddress"
                  placeholder="Complete address with postal code"
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange("fullAddress", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Tickets
              </CardTitle>
              <CardDescription>Set up your ticket types and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFree"
                  checked={formData.isFree}
                  onCheckedChange={(checked) => handleInputChange("isFree", checked)}
                />
                <Label htmlFor="isFree">This is a free event</Label>
              </div>

              {!formData.isFree && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Ticket Types</h4>
                    <Button type="button" variant="outline" size="sm" onClick={addTicketType}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ticket Type
                    </Button>
                  </div>

                  {ticketTypes.map((ticket, index) => (
                    <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Ticket Type {index + 1}</h5>
                        {ticketTypes.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeTicketType(ticket.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label>Ticket Name</Label>
                          <Input
                            placeholder="e.g., Regular, VIP"
                            value={ticket.name}
                            onChange={(e) => updateTicketType(ticket.id, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Price (IDR)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(ticket.id, "price", Number.parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={ticket.quantity}
                            onChange={(e) =>
                              updateTicketType(ticket.id, "quantity", Number.parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Input
                          placeholder="What's included in this ticket?"
                          value={ticket.description}
                          onChange={(e) => updateTicketType(ticket.id, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Promotions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Promotions
              </CardTitle>
              <CardDescription>Create discount vouchers for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Create time-limited promotions to boost ticket sales</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPromotionForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Promotion
                </Button>
              </div>

              {/* Existing Promotions */}
              {promotions.length > 0 && (
                <div className="space-y-3">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium">{promo.title}</h5>
                            <Badge variant="secondary">{promo.code}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{promo.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              {promo.discountType === "percentage"
                                ? `${promo.discountValue}% off`
                                : formatPrice(promo.discountValue)}
                            </span>
                            <span>
                              Valid: {promo.startDate} - {promo.endDate}
                            </span>
                            <span>Limit: {promo.usageLimit} uses</span>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removePromotion(promo.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Promotion Form */}
              {showPromotionForm && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">New Promotion</h5>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowPromotionForm(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Promotion Title</Label>
                      <Input
                        placeholder="e.g., Early Bird Discount"
                        value={newPromotion.title}
                        onChange={(e) => setNewPromotion((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Promo Code</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="PROMO2024"
                          value={newPromotion.code}
                          onChange={(e) => setNewPromotion((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        />
                        <Button type="button" variant="outline" size="sm" onClick={generatePromoCode}>
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Brief description of the promotion"
                      value={newPromotion.description}
                      onChange={(e) => setNewPromotion((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Discount Type</Label>
                      <Select
                        value={newPromotion.discountType}
                        onValueChange={(value: "percentage" | "fixed") =>
                          setNewPromotion((prev) => ({ ...prev, discountType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (IDR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Discount Value</Label>
                      <Input
                        type="number"
                        placeholder={newPromotion.discountType === "percentage" ? "10" : "50000"}
                        value={newPromotion.discountValue}
                        onChange={(e) =>
                          setNewPromotion((prev) => ({ ...prev, discountValue: Number.parseInt(e.target.value) || 0 }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Usage Limit</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newPromotion.usageLimit}
                        onChange={(e) =>
                          setNewPromotion((prev) => ({ ...prev, usageLimit: Number.parseInt(e.target.value) || 0 }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newPromotion.startDate}
                        onChange={(e) => setNewPromotion((prev) => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newPromotion.endDate}
                        onChange={(e) => setNewPromotion((prev) => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowPromotionForm(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={addPromotion}>
                      Add Promotion
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="button" variant="secondary">
              Save as Draft
            </Button>
            <Button type="submit">Publish Event</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
