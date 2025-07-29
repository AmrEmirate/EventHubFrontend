"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, DollarSign, Ticket, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createEvent } from "../../../lib/apihelper"; 

// Daftar kategori yang bisa dipilih
const categories = ["Technology", "Music", "Business", "Sports", "Education", "Arts", "Health"];

export default function CreateEventPage() {
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
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handler untuk semua perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Khusus untuk checkbox
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ 
        ...prev, 
        isFree: isChecked,
        price: isChecked ? 0 : prev.price // Reset harga jika event gratis
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler untuk komponen Select
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({...prev, [name]: value}));
  };
  
  // Handler baru untuk input file gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };


  // Fungsi untuk mengirim data ke backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Menggunakan FormData untuk mengirim data termasuk file
      const data = new FormData();
      
      // Append semua data dari state formData ke FormData object
      Object.entries(formData).forEach(([key, value]) => {
          data.append(key, String(value));
      });
      
      // Append file gambar jika ada
      if (imageFile) {
        data.append('imageUrl', imageFile); // Nama field 'imageUrl' harus cocok dengan di backend
      }

      await createEvent(data);
      alert("Event berhasil dibuat!");
      router.push("/organizer/dashboard");

    } catch (err: any) {
      console.error("Gagal membuat event:", err);
      const errorMessage = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : (err.response?.data?.message || "Terjadi kesalahan saat membuat event.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <CardTitle className="text-2xl">Buat Event Baru</CardTitle>
              <CardDescription>Isi detail di bawah ini untuk mempublikasikan event Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Event</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Konser Musik Merdeka" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Jelaskan tentang event Anda..." required />
              </div>

              {/* Input untuk gambar event */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Gambar Event</Label>
                <div className="relative flex items-center gap-4 rounded-md border border-input p-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <Input 
                    id="imageUrl" 
                    name="imageUrl" 
                    type="file" 
                    onChange={handleImageChange} 
                    accept="image/png, image/jpeg" 
                    className="border-0 shadow-none p-0 h-auto file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
                 <p className="text-xs text-muted-foreground mt-2">Pilih gambar utama untuk event Anda (JPG atau PNG, maks 5MB).</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                   <Select name="category" onValueChange={(value) => handleSelectChange("category", value)} required>
                      <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Contoh: Jakarta Convention Center" required />
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
                        <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} placeholder="0" disabled={formData.isFree} className="pl-8"/>
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
                {loading ? "Menyimpan..." : "Buat Event"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}