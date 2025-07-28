"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, CheckCircle, Clock, XCircle, ArrowLeft, Eye } from 'lucide-react';
import { getMyTransactions, uploadPaymentProof, Transaction } from '@/lib/apihelper';
import { toast } from "sonner";
import CountdownTimer from '@/components/ui/countdown-timer';
import PaymentInstructions from '../components/payment-instructions';

const TransactionStatusBadge = ({ status }: { status: Transaction['status'] }) => {
    const statusInfo = {
      'PENDING_PAYMENT': { text: "Menunggu Pembayaran", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
      'PENDING_CONFIRMATION': { text: "Menunggu Konfirmasi", icon: Clock, className: "bg-blue-100 text-blue-800" },
      'COMPLETED': { text: "Selesai", icon: CheckCircle, className: "bg-green-100 text-green-800" },
      'REJECTED': { text: "Ditolak", icon: XCircle, className: "bg-red-100 text-red-800" },
      'CANCELLED': { text: "Dibatalkan", icon: XCircle, className: "bg-gray-200 text-gray-800" },
      'EXPIRED': { text: "Kedaluwarsa", icon: Clock, className: "bg-orange-100 text-orange-800" },
    }[status];

    if (!statusInfo) return null;
    const Icon = statusInfo.icon;
    return (
        <Badge variant="outline" className={`border-0 ${statusInfo.className}`}>
            <Icon className="h-3.5 w-3.5 mr-1.5" />
            {statusInfo.text}
        </Badge>
    );
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await getMyTransactions();
      setTransactions(res.data);
    } catch (error) {
      toast.error("Tidak dapat memuat riwayat transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
  }, []);

  const handleUploadClick = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length || !selectedTransactionId) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('paymentProof', file); 
    setUploadingId(selectedTransactionId);
    try {
      await uploadPaymentProof(selectedTransactionId, formData);
      toast.success("Bukti pembayaran berhasil diunggah.");
      fetchTransactions();
    } catch (error) {
      toast.error("Gagal mengunggah bukti pembayaran.");
    } finally {
      setUploadingId(null);
      setSelectedTransactionId(null);
      if(event.target) event.target.value = '';
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  const pendingPaymentTransaction = transactions.find(trx => trx.status === 'PENDING_PAYMENT' && trx.finalPrice > 0);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* [PERBAIKAN] Tambahkan aria-label di sini */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload bukti pembayaran"
      />
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/profile"><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Profil</Link>
        </Button>
      </div>
      {pendingPaymentTransaction && <PaymentInstructions transaction={pendingPaymentTransaction} />}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Transaksi Saya</CardTitle>
          <CardDescription>Lihat dan kelola semua transaksi event Anda di sini.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? transactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-medium">{trx.event.name}</TableCell>
                      <TableCell className="text-right">{formatPrice(trx.finalPrice)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <TransactionStatusBadge status={trx.status} />
                          {trx.status === 'PENDING_PAYMENT' && trx.finalPrice > 0 && <CountdownTimer deadline={trx.paymentDeadline} />}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(trx.createdAt)}</TableCell>
                      <TableCell className="text-center">
                        {trx.status === 'COMPLETED' ? (
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/profile/transactions/${trx.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Tiket
                            </Link>
                          </Button>
                        ) : trx.status === 'PENDING_PAYMENT' && trx.finalPrice > 0 ? (
                          <Button size="sm" onClick={() => handleUploadClick(trx.id)} disabled={uploadingId === trx.id}>
                            {uploadingId === trx.id ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                            Upload Bukti
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="text-center h-24">Tidak ada riwayat transaksi.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}