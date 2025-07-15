// frontend/app/organizer/edit-event/[eventId]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, DollarSign, Ticket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getEventBySlug, updateEvent } from "../../../../lib/apihelper"; // Impor helper

const categories = ["Technology", "Music", "Business", "Sports", "Education", "Arts", "Health"];

export default function EditEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    price: 0,
    isFree: false,
    ticketTotal: 100,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { eventId } = params;

  // 1. Ambil data event yang ada untuk diisi ke formulir
  useEffect(() => {
    // Backend menggunakan ID untuk update, tetapi kita bisa pakai slug untuk mengambil data awalnya
    // Asumsi `eventId` dari URL adalah `slug` event
    if (typeof eventId !== "string") return;

    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await getEventBySlug(eventId as string); 
        const event = response.data;

        // Fungsi untuk format tanggal ke YYYY-MM-DDTHH:mm
        const toDateTimeLocal = (dateString: string) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return date.toISOString().slice(0, 16);
        };

        setFormData({
          name: event.name,
          description: event.description,
          category: event.category,
          location: event.location,
          startDate: toDateTimeLocal(event.startDate),
          endDate: toDateTimeLocal(event.endDate),
          price: event.price,
          isFree: event.isFree,
          ticketTotal: event.ticketTotal,
        });
      } catch (err) {
        setError("Gagal memuat data event.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const val = isCheckbox ? e.target.checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    if (name === 'isFree' && val === true) {
      setFormData(prev => ({ ...prev, price: 0, isFree: true }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  // 2. Fungsi untuk mengirim data yang sudah diupdate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof eventId !== "string") return;
    setLoading(true);
    setError(null);
    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        ticketTotal: Number(formData.ticketTotal),
      };
      
      // Menggunakan `eventId` sebagai ID untuk update
      await updateEvent(eventId, dataToSend); 
      alert("Event berhasil diperbarui!");
      router.push("/organizer/dashboard");
    } catch (err: any) {
      console.error("Gagal memperbarui event:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memperbarui event.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-6">
          <Link href="/organizer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Event</CardTitle>
              <CardDescription>Perbarui detail event Anda di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Event</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                   <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange("category", value)} required>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal & Waktu Mulai</Label>
                  <Input id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal & Waktu Selesai</Label>
                  <Input id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} type="datetime-local" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                    <Label htmlFor="price">Harga Tiket</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} disabled={formData.isFree} className="pl-8"/>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 pb-2">
                    <Checkbox id="isFree" name="isFree" checked={formData.isFree} onCheckedChange={(checked) => handleChange({ target: { name: 'isFree', value: '', type: 'checkbox', checked } } as any)} />
                    <Label htmlFor="isFree" className="cursor-pointer">Event ini Gratis</Label>
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="ticketTotal">Jumlah Tiket Tersedia</Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="ticketTotal" name="ticketTotal" type="number" min="1" value={formData.ticketTotal} onChange={handleChange} required className="pl-8"/>
                  </div>
              </div>
              {error && <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-md">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}