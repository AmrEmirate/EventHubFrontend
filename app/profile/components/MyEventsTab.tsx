"use client";
import { useEffect, useState } from "react";
import { getMyTransactions, Transaction } from "@/lib/apihelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyEventsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getMyTransactions();
        setTransactions(res.data.filter(t => t.status === 'COMPLETED'));
      } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  
  if (loading) return <div>Memuat event yang Anda ikuti...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiket Event Saya</CardTitle>
        <CardDescription>Ini adalah daftar tiket event yang telah berhasil Anda beli.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((trx) => (
            <div key={trx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
              <div>
                <p className="font-semibold text-lg">{trx.event.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(trx.event.startDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={`/events/${trx.event.slug}`}>Lihat Detail Event</Link>
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">Anda belum membeli tiket untuk event apapun.</p>
        )}
      </CardContent>
    </Card>
  );
}