"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTransactionById, Transaction } from '@/lib/apihelper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Calendar, MapPin, User, Hash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TransactionDetailPage() {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const transactionId = params.transactionId as string;

  useEffect(() => {
    if (!transactionId) return;
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const res = await getTransactionById(transactionId);
        setTransaction(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal memuat detail transaksi.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (error || !transaction) return <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">{error || 'Transaksi tidak ditemukan'}</div>;
  
  if (transaction.status !== 'COMPLETED') {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Tiket Belum Tersedia</h2>
            <p className="text-muted-foreground mb-4">
                Status transaksi ini adalah "{transaction.status}". E-tiket hanya tersedia untuk transaksi yang sudah selesai.
            </p>
            <Button variant="outline" size="sm" asChild>
                <Link href="/profile/transactions">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Riwayat Transaksi
                </Link>
            </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto max-w-lg px-4">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile/transactions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Riwayat Transaksi
            </Link>
          </Button>
        </div>
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center text-primary-foreground">
            <CardTitle className="text-2xl">E-TIKET</CardTitle>
            <CardDescription className="text-primary-foreground/80">Tiket ini valid untuk masuk ke event.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className='text-center'>
              <h3 className="text-xl font-bold">{transaction.event.name}</h3>
              <p className="text-sm text-muted-foreground">Diselenggarakan oleh EventHub</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center"><Calendar className="h-4 w-4 mr-2"/> TANGGAL</p>
                    <p className="font-semibold">{formatDate(transaction.event.startDate || '')}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center"><MapPin className="h-4 w-4 mr-2"/> LOKASI</p>
                    <p className="font-semibold">{transaction.event.location}</p>
                </div>
                 <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center"><User className="h-4 w-4 mr-2"/> NAMA PEMBELI</p>
                    <p className="font-semibold">{transaction.user.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center"><Hash className="h-4 w-4 mr-2"/> ID TRANSAKSI</p>
                    <p className="font-semibold break-all text-xs">{transaction.id}</p>
                </div>
            </div>

            <Separator />

            <div className="flex justify-center items-center flex-col p-4 bg-muted rounded-md">
                 <div className="w-36 h-36 bg-gray-300 flex items-center justify-center rounded-md">
                    <p className="text-xs text-gray-500">QR Code Placeholder</p>
                 </div>
                 <p className="mt-2 text-xs text-muted-foreground">Tunjukkan kode ini kepada panitia di lokasi.</p>
            </div>
             <Button className="w-full mt-4" onClick={() => window.print()}>Cetak atau Simpan Tiket</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}