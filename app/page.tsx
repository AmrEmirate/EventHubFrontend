// frontend/app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { getEvents, Event } from "@/lib/apihelper"; // Pastikan path ke lib sudah benar

const categories = ["All", "Technology", "Music", "Business", "Sports", "Education", "Arts"];
const locations = ["All", "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali"];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      const params: { search?: string; category?: string; location?: string } = {};
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedLocation !== "All") params.location = selectedLocation;

      try {
        const response = await getEvents(params);
        setEvents(response.data); 
      } catch (err) {
        console.error("Gagal mengambil data event:", err);
        setError("Tidak dapat memuat event saat ini. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearchTerm, selectedCategory, selectedLocation]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    // Hapus bagian <header> dari sini, karena sudah ada di layout.tsx
    <div className="bg-background">
       {/* Hero & Filters */}
       <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">Discover Amazing Events</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 md:py-6 text-base md:text-lg bg-white/90 text-black"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/90 text-black"><SelectValue placeholder="Kategori" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/90 text-black"><SelectValue placeholder="Lokasi" /></SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center">Memuat event...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Tidak ada event yang ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah kriteria pencarian atau filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {events.map((event) => (
                <Link href={`/events/${event.slug}`} key={event.id} className="block">
                  <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-white">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg line-clamp-2">{event.name}</CardTitle>
                        <Badge variant="outline" className="text-xs shrink-0 w-fit">{event.category}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4 pt-0 flex-grow">
                        <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="truncate">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Button className="w-full" size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}