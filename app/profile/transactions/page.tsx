// frontend/app/profile/transactions/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2, FileClock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getMyTransactions, uploadPaymentProof, Transaction } from "@/lib/apihelper"; // Menggunakan path alias
import { ReviewForm } from "@/components/reviews/review-form"; // Menggunakan path alias

const StatusBadge = ({ status }: { status: Transaction['status'] }) => {
  const statusInfo: { [key: string]: { text: string; color: string; icon: React.ElementType } } = {
    PENDING_PAYMENT: { text: "Menunggu Pembayaran", color: "bg-yellow-500", icon: FileClock },
    PENDING_CONFIRMATION: { text: "Menunggu Konfirmasi", color: "bg-blue-500", icon: FileClock },
    COMPLETED: { text: "Selesai", color: "bg-green-500", icon: CheckCircle },
    CANCELLED: { text: "Dibatalkan", color: "bg-gray-500", icon: XCircle },
    EXPIRED: { text: "Kedaluwarsa", color: "bg-red-500", icon: XCircle },
    REJECTED: { text: "Ditolak", color: "bg-red-600", icon: XCircle },
  };
  
  const info = statusInfo[status] || { text: status, color: "bg-gray-400", icon: FileClock };
  const Icon = info.icon;

  return <Badge className={`${info.color} hover:${info.color} text-white flex items-center gap-2`}><Icon className="h-4 w-4"/>{info.text}</Badge>;
};

export default function MyTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [reviewDialog, setReviewDialog] = useState<{open: boolean, trx: Transaction | null}>({open: false, trx: null});

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getMyTransactions();
      setTransactions(response.data);
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
      setError("Tidak dapat memuat riwayat transaksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, transactionId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(transactionId);
    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      await uploadPaymentProof(transactionId, formData);
      alert("Bukti pembayaran berhasil diunggah!");
      fetchTransactions();
    } catch (err) {
      console.error("Gagal mengunggah bukti:", err);
      alert("Gagal mengunggah bukti pembayaran.");
    } finally {
      setUploadingId(null);
    }
  };
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' });
  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Profil
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi Saya</CardTitle>
            <CardDescription>Lihat dan kelola semua transaksi event Anda di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((trx) => (
                      <TableRow key={trx.id}>
                        <TableCell className="font-medium">{trx.event.name}</TableCell>
                        <TableCell>{formatPrice(trx.finalPrice)}</TableCell>
                        <TableCell><StatusBadge status={trx.status} /></TableCell>
                        <TableCell>{formatDate(trx.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          {trx.status === 'PENDING_PAYMENT' && (
                            <Button asChild variant="default" size="sm">
                              <label htmlFor={`upload-${trx.id}`} className="cursor-pointer">
                                {uploadingId === trx.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                                Upload Bukti
                                <Input id={`upload-${trx.id}`} type="file" className="hidden" onChange={(e) => handleFileUpload(e, trx.id)} disabled={!!uploadingId}/>
                              </label>
                            </Button>
                          )}
                           {trx.status === 'COMPLETED' && (
                             <Button variant="outline" size="sm" onClick={() => setReviewDialog({open: true, trx: trx})}>Beri Ulasan</Button>
                           )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} className="text-center">Anda belum memiliki transaksi.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

       <Dialog open={reviewDialog.open} onOpenChange={(isOpen) => setReviewDialog({open: isOpen, trx: null})}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Ulas Event: {reviewDialog.trx?.event.name}</DialogTitle>
           </DialogHeader>
           {reviewDialog.trx && (
              <ReviewForm 
                eventId={reviewDialog.trx.event.id} 
                onReviewSubmit={() => {
                    setReviewDialog({open: false, trx: null});
                }}
              />
           )}
         </DialogContent>
       </Dialog>
    </>
  );
}