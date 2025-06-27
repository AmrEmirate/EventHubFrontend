"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MobileNav } from "@/components/mobile-nav"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      value: "support@eventhub.id",
      action: "mailto:support@eventhub.id",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm",
      value: "+62 21 1234 5678",
      action: "tel:+622112345678",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "Jakarta, Indonesia",
      action: "#",
    },
    {
      icon: Clock,
      title: "Working Hours",
      description: "Our support team is available",
      value: "Mon-Fri: 9AM-6PM WIB",
      action: "#",
    },
  ]

  const faqItems = [
    {
      question: "How do I create an event?",
      answer:
        "Sign up as an organizer, go to your dashboard, and click 'Create Event'. Fill in all the required details and publish your event.",
    },
    {
      question: "How do I get a refund?",
      answer:
        "Refunds are processed according to the event organizer's refund policy. Contact the organizer directly or reach out to our support team.",
    },
    {
      question: "Can I transfer my ticket to someone else?",
      answer:
        "Ticket transfers depend on the event organizer's policy. Check your ticket details or contact the organizer for transfer options.",
    },
    {
      question: "How do I use my points and coupons?",
      answer:
        "During checkout, you can apply coupon codes and choose to use your points for discounts. Points and coupons will be automatically applied.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
              <CalendarDays className="h-8 w-8" />
              <span>EventHub</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Browse Events
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-primary font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
              <MobileNav currentPath="/contact" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 max-w-3xl mx-auto">
            Have questions? We're here to help! Reach out to our friendly support team
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full mb-3 md:mb-4">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg mb-2">{info.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3">{info.description}</p>
                    {info.action !== "#" ? (
                      <a href={info.action} className="text-primary hover:underline font-medium text-sm md:text-base">
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-medium text-sm md:text-base">{info.value}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-sm">
                        Category
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="event">Event Management</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide details about your inquiry..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={6}
                        required
                        className="text-sm"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">Quick answers to common questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-semibold mb-2 text-sm md:text-base">{faq.question}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Need Immediate Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">Help Center</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Browse our knowledge base</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Visit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">Live Chat</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Chat with our support team</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm md:text-base">WhatsApp</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Message us on WhatsApp</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Office Locations */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Our Offices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Jakarta (Headquarters)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                      <span>Jl. Sudirman No. 123, Jakarta Pusat 10220</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      +62 21 1234 5678
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Mon-Fri: 9AM-6PM WIB
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Bandung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                      <span>Jl. Asia Afrika No. 456, Bandung 40111</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      +62 22 8765 4321
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Mon-Fri: 9AM-5PM WIB
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Surabaya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                      <span>Jl. Pemuda No. 789, Surabaya 60271</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      +62 31 9876 5432
                    </p>
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Mon-Fri: 9AM-5PM WIB
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EventHub</h3>
              <p className="text-muted-foreground text-sm">
                Your premier destination for discovering and managing amazing events in Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Attendees</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/">Browse Events</Link>
                </li>
                <li>
                  <Link href="/my-tickets">My Tickets</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizers</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/organizer/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/organizer/create-event">Create Event</Link>
                </li>
                <li>
                  <Link href="/organizer/analytics">Analytics</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
