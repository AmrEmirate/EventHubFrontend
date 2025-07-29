"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { getEvents, Event } from "@/lib/apihelper";
import Image from 'next/image';
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const categories = ["All", "Technology", "Music", "Business", "Sports", "Education", "Arts"];
const locations = ["All", "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali"];

function EventCard({ event }: { event: Event }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-card">
        <CardHeader className="p-0">
          <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
            <Image
              src={event.imageUrl ? `${API_BASE_URL}${event.imageUrl}` : `https://picsum.photos/seed/${event.id}/400/300`}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <Badge variant="outline" className="text-xs shrink-0 w-fit mb-2">{event.category}</Badge>
          <CardTitle className="text-base md:text-lg line-clamp-2 flex-grow">{event.name}</CardTitle>
          <div className="space-y-2 mt-2 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="truncate">{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{event.location}</span>
              </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button className="w-full" size="sm">Lihat Detail</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      const params: { [key: string]: string } = {};
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedLocation !== "All") params.location = selectedLocation;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      try {
        const response = await getEvents(params);
        setEvents(response.data); 
      } catch (err) {
        setError("Tidak dapat memuat event saat ini. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearchTerm, selectedCategory, selectedLocation, startDate, endDate]);

  return (
    <div className="bg-background">
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">Temukan Event Menarik</h1>
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari event berdasarkan nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 md:py-6 text-base md:text-lg bg-white/90 text-black"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-white/90 text-black"><SelectValue placeholder="Kategori" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full bg-white/90 text-black"><SelectValue placeholder="Lokasi" /></SelectTrigger>
                <SelectContent>
                  {locations.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="w-full text-left">
                  <Label htmlFor="startDate" className="text-xs ml-1">Dari Tanggal</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white/90 text-black"/>
              </div>
               <div className="w-full text-left">
                  <Label htmlFor="endDate" className="text-xs ml-1">Sampai Tanggal</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white/90 text-black" min={startDate}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Tidak ada event yang ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah kriteria pencarian atau filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}