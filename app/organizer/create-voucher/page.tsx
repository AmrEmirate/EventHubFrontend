"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMyOrganizerEvents, createOrganizerVoucher, Event } from "../../../lib/apihelper";
import { toast } from "sonner";

// Skema validasi untuk form voucher
const voucherSchema = z.object({
  eventId: z.string().uuid("Anda harus memilih event"),
  code: z.string().min(5, "Kode minimal 5 karakter").max(20, "Kode maksimal 20 karakter"),
  discountPercent: z.coerce.number().int().min(1, "Diskon minimal 1%").max(100, "Diskon maksimal 100%"),
  maxDiscount: z.coerce.number().positive("Maksimal diskon harus angka positif").optional().nullable(),
  expiresAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Tanggal tidak valid" }),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

export default function CreateVoucherPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
  });

  // Ambil daftar event milik organizer
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getMyOrganizerEvents();
        setEvents(res.data);
      } catch (error) {
        toast.error("Gagal memuat daftar event Anda.");
      }
    };
    fetchEvents();
  }, []);

  const onSubmit = async (data: VoucherFormData) => {
    setLoading(true);
    try {
      await createOrganizerVoucher(data);
      toast.success("Voucher berhasil dibuat!");
      router.push("/organizer/dashboard");
    } catch (err: any) {
      toast.error("Gagal membuat voucher", {
        description: err.response?.data?.message || "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-6">
          <Link href="/organizer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center"><Tag className="mr-3"/>Buat Voucher Baru</CardTitle>
              <CardDescription>Buat kode diskon untuk event spesifik Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Pilih Event</Label>
                <Select onValueChange={(value) => form.setValue('eventId', value)} required>
                  <SelectTrigger><SelectValue placeholder="Pilih event yang akan diberi diskon..." /></SelectTrigger>
                  <SelectContent>
                    {events.map(event => <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {form.formState.errors.eventId && <p className="text-sm text-red-500">{form.formState.errors.eventId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Kode Voucher</Label>
                <Input id="code" {...form.register('code')} placeholder="Contoh: DISKONBARU25" />
                {form.formState.errors.code && <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Persentase Diskon (%)</Label>
                  <Input id="discountPercent" type="number" {...form.register('discountPercent')} placeholder="Contoh: 10" />
                   {form.formState.errors.discountPercent && <p className="text-sm text-red-500">{form.formState.errors.discountPercent.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Maksimal Potongan (Rp)</Label>
                  <Input id="maxDiscount" type="number" {...form.register('maxDiscount')} placeholder="Contoh: 50000 (kosongkan jika tanpa batas)" />
                   {form.formState.errors.maxDiscount && <p className="text-sm text-red-500">{form.formState.errors.maxDiscount.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Tanggal Kedaluwarsa</Label>
                <Input id="expiresAt" type="datetime-local" {...form.register('expiresAt')} />
                {form.formState.errors.expiresAt && <p className="text-sm text-red-500">{form.formState.errors.expiresAt.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Menyimpan..." : "Buat Voucher"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}