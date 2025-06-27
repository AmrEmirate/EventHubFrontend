"use client"

import Link from "next/link"
import Image from "next/image"
import { Users, Target, Award, Heart, CheckCircle, Star, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"

export default function AboutPage() {
  const stats = [
    { label: "Events Organized", value: "10,000+", icon: Target },
    { label: "Happy Customers", value: "500,000+", icon: Users },
    { label: "Event Organizers", value: "2,500+", icon: Award },
    { label: "Cities Covered", value: "50+", icon: Heart },
  ]

  const features = [
    {
      title: "Easy Event Discovery",
      description: "Find events that match your interests with our advanced search and filtering system.",
      icon: Target,
    },
    {
      title: "Secure Transactions",
      description: "Safe and secure payment processing with multiple payment options available.",
      icon: CheckCircle,
    },
    {
      title: "Organizer Tools",
      description: "Comprehensive dashboard for event organizers to manage events, tickets, and analytics.",
      icon: Award,
    },
    {
      title: "Rewards Program",
      description: "Earn points and get exclusive discounts through our referral and loyalty program.",
      icon: Star,
    },
  ]

  const team = [
    {
      name: "Ahmad Rizki",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate about connecting people through amazing events and experiences.",
    },
    {
      name: "Sarah Putri",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
      bio: "Tech enthusiast focused on building scalable and user-friendly platforms.",
    },
    {
      name: "Budi Santoso",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Ensuring smooth operations and exceptional customer experience.",
    },
    {
      name: "Siti Nurhaliza",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Building brand awareness and connecting with our community.",
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
              <Link href="/about" className="text-primary font-medium">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
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
              <MobileNav currentPath="/about" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">About EventHub</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 max-w-3xl mx-auto">
            We're on a mission to connect people through amazing events and create unforgettable experiences across
            Indonesia
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full mb-3 md:mb-4">
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-muted-foreground text-sm md:text-base">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground text-sm md:text-base">
                  <p>
                    EventHub was born from a simple idea: everyone deserves access to amazing events and experiences.
                    Founded in 2020, we started as a small team passionate about bringing people together through
                    technology and events.
                  </p>
                  <p>
                    What began as a local event discovery platform has grown into Indonesia's leading event management
                    ecosystem, serving hundreds of thousands of event-goers and thousands of organizers across the
                    country.
                  </p>
                  <p>
                    Today, we're proud to be the bridge that connects event organizers with their audiences, making it
                    easier than ever to discover, attend, and organize memorable events.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop"
                  alt="EventHub team"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm md:text-base">
                    To democratize event discovery and management by providing a comprehensive platform that empowers
                    organizers to create exceptional events and helps attendees discover experiences that enrich their
                    lives.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm md:text-base">
                    To become Southeast Asia's most trusted and innovative event ecosystem, fostering connections and
                    creating lasting memories through technology-enabled experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Why Choose EventHub?</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need for a seamless event experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full mb-3 md:mb-4">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base md:text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Meet Our Team</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind EventHub's success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-base md:text-lg mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {member.role}
                  </Badge>
                  <p className="text-xs md:text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Our Values</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Community First</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                We prioritize building strong communities and fostering meaningful connections between people.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Excellence</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                We strive for excellence in everything we do, from our platform to our customer service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Innovation</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                We continuously innovate to provide better solutions and experiences for our users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of event organizers and attendees who trust EventHub for their event needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
