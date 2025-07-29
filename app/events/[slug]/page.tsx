"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowLeft, Loader2, Ticket, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEventBySlug, getMyTransactions, EventWithReviews, Transaction } from "@/lib/apihelper";
import { ReviewForm } from "@/components/reviews/review-form";
import { useAuth } from "@/context/AuthContext";

export default function EventDetailPage() {
  const [event, setEvent] = useState<EventWithReviews | null>(null);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

  const fetchData = async () => {
    if (typeof slug !== 'string') {
      setError("URL event tidak valid.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      const eventRes = await getEventBySlug(slug);
      setEvent(eventRes.data);
      
      if (isAuthenticated) {
        const transactionRes = await getMyTransactions();
        setUserTransactions(transactionRes.data);
      }
    } catch (err) {
      console.error("Gagal memuat detail event:", err);
      setError("Event yang Anda cari tidak dapat ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug, isAuthenticated]);

  const canReview = isAuthenticated && 
                    event &&
                    userTransactions.some(trx => trx.event.id === event.id && trx.status === 'COMPLETED');

  const hasReviewed = event?.reviews.some(review => review.user.name === user?.name);

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tanggal tidak tersedia";
    return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !event) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold mb-2">Oops! Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => router.push('/')}><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Halaman Utama</Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 pb-12">
      <div className="relative">
        <div className="relative h-64 md:h-96 w-full bg-slate-200">
          <Image
              src={event.imageUrl ? `${API_BASE_URL}${event.imageUrl}` : 'https://placehold.co/1200x400/e2e8f0/64748b?text=Event+Image'}
              alt={event.name}
              fill
              className="object-cover"
              priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative -mt-16 md:-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{event.category}</Badge>
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

              <Card>
                  <CardHeader>
                      <CardTitle>Ulasan Event</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {canReview && !hasReviewed && (
                      <>
                        <p className="text-muted-foreground mb-4">Bagikan pengalaman Anda di event ini!</p>
                        <ReviewForm eventId={event.id} onReviewSubmit={fetchData} />
                        <Separator className="my-6"/>
                      </>
                    )}
                    
                    {event.reviews && event.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {event.reviews.map(review => (
                          <div key={review.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                            <Avatar>
                              <AvatarImage src={review.user.profile?.avatarUrl ? `${API_BASE_URL}${review.user.profile.avatarUrl}` : undefined} />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                              <p className="font-semibold">{review.user.name}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                ))}
                              </div>
                              
                              {/* [PERBAIKAN] Ubah ukuran gambar di sini */}
                              {review.imageUrl && (
                                <div className="mt-3 relative w-full md:w-1/2 h-48 rounded-lg overflow-hidden">
                                  <Image
                                    src={`${API_BASE_URL}${review.imageUrl}`}
                                    alt={`Ulasan dari ${review.user.name}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 500px"
                                  />
                                </div>
                              )}

                              <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2">Belum ada ulasan untuk event ini.</p>
                      </div>
                    )}
                  </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader><CardTitle>Dapatkan Tiket Anda</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold"><span>{formatPrice(event.price)}</span></div>
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
    </div>
  );
}
