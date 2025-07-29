"use client";
import { useEffect, useState } from "react";
import { getMyTransactions, Transaction } from "@/lib/apihelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, History, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/reviews/review-form"; // Pastikan path ini benar

export default function MyEventsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getMyTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Gagal mengambil transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleOpenReviewModal = (trx: Transaction) => {
    setSelectedTransaction(trx);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = () => {
    setIsReviewModalOpen(false);
    setSelectedTransaction(null);
    // Optional: Anda bisa refresh data transaksi jika ingin menyembunyikan tombol setelah review
  };
  
  if (loading) return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin h-6 w-6" /></div>;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Tiket Event Saya</CardTitle>
              <CardDescription>Ini adalah daftar tiket event yang telah Anda beli.</CardDescription>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/profile/transactions"><History className="mr-2 h-4 w-4"/> Lihat Semua Transaksi</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.filter(t => t.status === 'COMPLETED').length > 0 ? (
            transactions.filter(t => t.status === 'COMPLETED').map((trx) => (
              <div key={trx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div>
                  <p className="font-semibold text-lg">{trx.event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trx.event.startDate).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                  <Button variant="secondary" className="w-full sm:w-auto" onClick={() => handleOpenReviewModal(trx)}>
                    <MessageSquare className="mr-2 h-4 w-4"/>
                    Beri Ulasan
                  </Button>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/profile/transactions/${trx.id}`}>
                      <Ticket className="mr-2 h-4 w-4"/>
                      Lihat E-Tiket
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 font-semibold">Anda belum memiliki tiket aktif.</p>
              <p className="text-sm">Beli tiket event untuk melihat e-tiket Anda di sini.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal untuk Form Ulasan */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beri Ulasan untuk {selectedTransaction?.event.name}</DialogTitle>
            <DialogDescription>
              Bagikan pengalaman Anda. Ulasan Anda akan sangat membantu pengguna lain.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <ReviewForm
              eventId={selectedTransaction.event.id}
              onReviewSubmit={handleReviewSubmitted}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
