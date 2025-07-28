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
import { getEventBySlug, Event } from "@/lib/apihelper";
import { ReviewForm } from "@/components/reviews/review-form";

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const fetchEventDetail = async () => {
    if (typeof slug !== 'string') {
        setError("Invalid event URL.");
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const response = await getEventBySlug(slug);
      setEvent(response.data);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setError("Event yang Anda cari tidak dapat ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [slug]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tanggal tidak tersedia";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !event) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold mb-2">Oops! Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Halaman Utama
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 pb-12">
      {/* Gambar Banner */}
      <div className="relative h-64 md:h-96 w-full bg-slate-200">
        <Image
            src={event.imageUrl || '/placeholder.jpg'} // Gunakan gambar placeholder jika tidak ada
            alt={event.name}
            fill
            className="object-cover"
            priority
        />
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Konten Utama (Deskripsi, dll) */}
          <div className="lg:col-span-2 space-y-6">
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
                      <p className="font-medium">Tanggal & Waktu</p>
                      <p className="text-sm">{formatDate(event.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Lokasi</p>
                      <p className="text-sm">{event.location}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="prose max-w-none mt-6">
                  <h3 className="font-semibold">Deskripsi Event</h3>
                  <p>{event.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Bagian Ulasan/Review */}
            <Card>
                <CardHeader>
                    <CardTitle>Ulasan Event</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Logika untuk menampilkan ulasan yang sudah ada bisa ditambahkan di sini */}
                    <p className="text-muted-foreground mb-4">Bagikan pengalaman Anda di event ini!</p>
                    <ReviewForm eventId={event.id} onReviewSubmit={fetchEventDetail} />
                </CardContent>
            </Card>
          </div>

          {/* Sidebar Pembelian Tiket */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Dapatkan Tiket Anda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  <span>{formatPrice(event.price)}</span>
                </div>
                <Separator/>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Sisa tiket: {event.ticketTotal - event.ticketSold}</span>
                </div>
                <Link href={`/checkout/${event.slug}`} className="w-full block">
                  <Button className="w-full" size="lg" disabled={event.ticketTotal - event.ticketSold <= 0}>
                    <Ticket className="mr-2 h-4 w-4" />
                    {event.ticketTotal - event.ticketSold > 0 ? 'Beli Tiket' : 'Tiket Habis'}
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