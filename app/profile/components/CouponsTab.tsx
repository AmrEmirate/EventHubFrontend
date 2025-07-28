"use client";
import { useEffect, useState } from "react";
import { getMyVouchers, Voucher } from "@/lib/apihelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CouponsTab() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await getMyVouchers();
        setVouchers(res.data);
      } catch (error) {
        console.error("Gagal mengambil voucher:", error);
        toast.error("Gagal memuat daftar kupon.");
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.info("Kode Disalin!", { description: `${code} telah disalin ke clipboard.` });
  };

  if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin h-6 w-6" /></div>;

  return (
     <Card>
      <CardHeader>
        <CardTitle>Kupon & Voucher Saya</CardTitle>
        <CardDescription>Ini adalah daftar kode diskon aktif yang Anda miliki. Klik kode untuk menyalin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <div key={voucher.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Ikon berbeda untuk voucher event vs kupon umum */}
                {voucher.event ? (
                  <Ticket className="h-10 w-10 text-primary flex-shrink-0" />
                ) : (
                  <Star className="h-10 w-10 text-yellow-500 flex-shrink-0" />
                )}
                
                <div className="flex-grow">
                  <p className="font-bold text-lg">Diskon {voucher.discountPercent}%</p>
                  
                  {/* Tampilkan nama event jika ada, atau keterangan umum jika tidak */}
                  {voucher.event ? (
                     <p className="text-xs text-primary font-medium">Khusus untuk event: {voucher.event.name}</p>
                  ) : (
                     <p className="text-xs text-yellow-600 font-medium">Berlaku untuk semua event</p>
                  )}
                  
                  <p 
                    className="text-sm text-muted-foreground cursor-pointer mt-1"
                    onClick={() => copyToClipboard(voucher.code)}
                  >
                    Kode: <span className="font-semibold text-primary underline decoration-dotted">{voucher.code}</span>
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                 <p className="text-sm text-muted-foreground">Berlaku hingga</p>
                 <p className="font-semibold">{formatDate(voucher.expiresAt)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <Ticket className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 font-semibold">Anda belum memiliki kupon atau voucher aktif.</p>
            <p className="text-sm">Dapatkan kupon dengan mendaftar menggunakan kode referral!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}