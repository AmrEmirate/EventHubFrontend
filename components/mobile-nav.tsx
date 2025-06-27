"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User, Building, Home, Info, Phone, LogIn, UserPlus, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface MobileNavProps {
  currentPath?: string
}

export function MobileNav({ currentPath = "/" }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Browse Events",
      href: "/",
      icon: Home,
    },
    {
      title: "About",
      href: "/about",
      icon: Info,
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Phone,
    },
  ]

  const authItems = [
    {
      title: "Login",
      href: "/auth/login",
      icon: LogIn,
      variant: "ghost" as const,
    },
    {
      title: "Sign Up",
      href: "/auth/register",
      icon: UserPlus,
      variant: "default" as const,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold text-primary"
              onClick={() => setOpen(false)}
            >
              <CalendarDays className="h-7 w-7" />
              <span>EventHub</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-8">
          {/* Navigation Links */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>

          <Separator />

          {/* Auth Buttons */}
          <div className="space-y-3">
            {authItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  <Button variant={item.variant} className="w-full justify-start" size="lg">
                    <Icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </div>

          <Separator />

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Quick Links</h4>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/organizer/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
            >
              <Building className="h-5 w-5" />
              <span>Organizer Dashboard</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
