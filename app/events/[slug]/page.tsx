"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowLeft, Loader2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEventBySlug, Event } from "../../../lib/apihelper"; // Ensure this path points to your lib directory

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  useEffect(() => {
    if (typeof slug !== 'string') {
        setError("Invalid event URL.");
        setLoading(false);
        return;
    }

    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const response = await getEventBySlug(slug);
        setEvent(response.data);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Could not find the event you're looking for.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !event) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Events
        </Button>
      </div>
    );
  }

  return (
    // The <header> element has been removed from here.
    <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Events
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardContent className="p-0">
                        <Image
                            src={"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop"} // Placeholder image
                            alt={event.name}
                            width={800}
                            height={400}
                            className="w-full h-auto max-h-96 object-cover rounded-t-lg bg-muted"
                            priority
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Badge variant="outline" className="w-fit">{event.category}</Badge>
                        <CardTitle className="text-3xl md:text-4xl !mt-4">{event.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-5 w-5 mr-3 text-primary" />
                                <div>
                                <p className="font-medium">Date & Time</p>
                                <p className="text-sm">{formatDate(event.startDate)}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-5 w-5 mr-3 text-primary" />
                                <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm">{event.location}</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="prose max-w-none mt-6">
                            <h3 className="font-semibold">Event Description</h3>
                            <p>{event.description}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle>Get Your Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-2xl font-bold">
                        <span>{formatPrice(event.price)}</span>
                    </div>
                    
                    <Separator/>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Tickets left: {event.ticketTotal - event.ticketSold}</span>
                    </div>
                    
                    <Link href={`/checkout/${event.slug}`} className="w-full block">
                        <Button className="w-full" size="lg" disabled={event.ticketTotal - event.ticketSold === 0}>
                            {event.ticketTotal - event.ticketSold > 0 ? 'Buy Tickets' : 'Sold Out'}
                        </Button>
                    </Link>
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
    </div>
  );
}