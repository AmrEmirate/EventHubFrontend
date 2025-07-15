"use client";
import { useEffect, useState } from "react";
import { getMyVouchers, Voucher } from "@/lib/apihelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { toast } from "sonner"; // [PERBAIKAN] Impor dari sonner

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
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // [PERBAIKAN] Menggunakan toast dari sonner
    toast.info("Kode Disalin!", { description: `${code} telah disalin ke clipboard.` });
  };

  if (loading) return <div>Memuat kupon...</div>;

  return (
     <Card>
      <CardHeader>
        <CardTitle>Kupon Saya</CardTitle>
        <CardDescription>Klik kode untuk menyalin dan gunakan saat checkout.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <div key={voucher.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <Ticket className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">Diskon {voucher.discountPercent}%</p>
                  <p 
                    className="text-sm text-muted-foreground cursor-pointer"
                    onClick={() => copyToClipboard(voucher.code)}
                  >
                    Kode: <span className="font-semibold text-primary underline decoration-dotted">{voucher.code}</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-right">Berlaku hingga <br/> {formatDate(voucher.expiresAt)}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">Anda tidak memiliki kupon aktif saat ini.</p>
        )}
      </CardContent>
    </Card>
  );
}