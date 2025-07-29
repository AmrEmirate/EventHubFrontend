"use client";
import { useEffect, useState } from "react";
import { getMyTransactions, Transaction } from "@/lib/apihelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, History, MessageSquare } from "lucide-react";

export default function MyEventsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await getMyTransactions();
        // Filter hanya untuk tiket yang sudah berhasil didapatkan (status COMPLETED)
        setTransactions(res.data.filter(t => t.status === 'COMPLETED'));
      } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  
  if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin h-6 w-6" /></div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tiket Event Saya</CardTitle>
            <CardDescription>Ini adalah daftar e-tiket yang telah berhasil Anda dapatkan.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/profile/transactions"><History className="mr-2 h-4 w-4"/> Lihat Semua Transaksi</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((trx) => {
            // Cek apakah event sudah selesai
            const isEventFinished = new Date(trx.event.endDate) < new Date();

            return (
              <div key={trx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div>
                  <p className="font-semibold text-lg">{trx.event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trx.event.startDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {/* Tombol ulasan hanya muncul jika event sudah selesai */}
                  {isEventFinished && (
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <Link href={`/events/${trx.event.slug}`}>
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        Beri Ulasan
                      </Link>
                    </Button>
                  )}
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/profile/transactions/${trx.id}`}>
                      <Ticket className="mr-2 h-4 w-4"/>
                      Lihat E-Tiket
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <Ticket className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 font-semibold">Anda belum memiliki tiket aktif.</p>
            <p className="text-sm">Beli tiket event untuk melihat e-tiket Anda di sini.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
