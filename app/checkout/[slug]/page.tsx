// frontend/app/checkout/[slug]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Ticket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getEventBySlug, createTransaction, getMyProfile, getMyVouchers, Event, UserProfile, Voucher } from "../../../lib/apihelper";

export default function CheckoutPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [voucherCode, setVoucherCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  // Mengambil semua data yang diperlukan (event, profil, voucher)
  useEffect(() => {
    if (typeof slug !== "string") return;

    const fetchCheckoutData = async () => {
      setLoading(true);
      try {
        // Ambil data secara paralel untuk efisiensi
        const [eventRes, profileRes, vouchersRes] = await Promise.all([
          getEventBySlug(slug),
          getMyProfile(),
          getMyVouchers()
        ]);
        
        setEvent(eventRes.data);
        setProfile(profileRes.data);
        setVouchers(vouchersRes.data);

      } catch (err) {
        setError("Gagal memuat data checkout. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckoutData();
  }, [slug]);
  
  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };
  
  const handleCheckout = async () => {
    if (!event) return;
    setIsProcessing(true);
    setError(null);

    try {
      const transactionData = {
        eventId: event.id,
        quantity: quantity,
        voucherCode: voucherCode || undefined,
        usePoints: usePoints,
      };
      const response = await createTransaction(transactionData);
      alert("Transaksi berhasil dibuat! Silakan lanjutkan pembayaran.");
      router.push(`/profile/transactions`); // Arahkan ke halaman transaksi
    } catch (err: any) {
      console.error("Gagal membuat transaksi:", err);
      setError(err.response?.data?.message || "Gagal membuat transaksi.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Kalkulasi harga
  let subtotal = event?.price ? event.price * quantity : 0;
  let finalPrice = subtotal;
  let pointsUsed = 0;
  let discountAmount = 0;

  const appliedVoucher = vouchers.find(v => v.code === voucherCode);
  if (appliedVoucher) {
      discountAmount = (subtotal * appliedVoucher.discountPercent) / 100;
      if (appliedVoucher.maxDiscount && discountAmount > appliedVoucher.maxDiscount) {
          discountAmount = appliedVoucher.maxDiscount;
      }
      finalPrice -= discountAmount;
  }

  if (usePoints && profile) {
      pointsUsed = Math.min(finalPrice, profile.points);
      finalPrice -= pointsUsed;
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (error || !event) return <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">{error || "Event tidak ditemukan."}</div>;

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Checkout</CardTitle>
            <CardDescription>Selesaikan pesanan untuk event: <span className="font-semibold">{event.name}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Detail Pesanan</h4>
              <div className="flex justify-between"><p>Harga Tiket</p><p>{formatPrice(event.price)}</p></div>
              <div className="flex justify-between items-center"><p>Jumlah</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                  <span className="font-bold w-10 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            <Separator/>
            
            <div className="space-y-4">
                <h4 className="font-medium">Gunakan Poin & Voucher</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox id="usePoints" checked={usePoints} onCheckedChange={(checked) => setUsePoints(Boolean(checked))} disabled={!profile || profile.points === 0} />
                    <Label htmlFor="usePoints" className="text-sm font-medium">Gunakan {profile?.points.toLocaleString() || 0} poin Anda?</Label>
                </div>
                <div className="flex gap-2">
                    <Input placeholder="Masukkan kode voucher" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} />
                    <Button variant="outline" disabled={!appliedVoucher}>Terapkan</Button>
                </div>
                {appliedVoucher && <p className="text-sm text-green-600">Voucher {appliedVoucher.discountPercent}% berhasil diterapkan!</p>}
            </div>

            <Separator/>

            <div className="space-y-2">
                <div className="flex justify-between"><p>Subtotal</p><p>{formatPrice(subtotal)}</p></div>
                {discountAmount > 0 && <div className="flex justify-between text-green-600"><p>Diskon Voucher</p><p>- {formatPrice(discountAmount)}</p></div>}
                {pointsUsed > 0 && <div className="flex justify-between text-green-600"><p>Potongan Poin</p><p>- {formatPrice(pointsUsed)}</p></div>}
                <div className="flex justify-between text-xl font-bold"><p>Total Akhir</p><p>{formatPrice(finalPrice)}</p></div>
            </div>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? "Memproses..." : "Lanjutkan ke Pembayaran"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}