"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const bankAccounts = [
    { bank: "BCA", name: "PT EventHub Indonesia", number: "1234567890" },
    { bank: "Mandiri", name: "PT EventHub Indonesia", number: "0987654321" },
];

// Pastikan tipe 'transaction' sesuai dengan yang Anda butuhkan
export default function PaymentInstructions({ transaction }: { transaction: { finalPrice: number } }) {

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} disalin!`, { description: text });
    };

    return (
        <Card className="mt-6 border-blue-500 animate-in fade-in-50">
            <CardHeader>
                <CardTitle>Selesaikan Pembayaran Anda</CardTitle>
                <CardDescription>
                    Silakan transfer sejumlah total tagihan ke salah satu rekening di bawah ini sebelum waktu habis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-semibold">Total yang harus dibayar:</p>
                    <p 
                        className="text-2xl font-bold text-blue-600 cursor-pointer"
                        onClick={() => copyToClipboard(transaction.finalPrice.toString(), "Total Harga")}
                    >
                        Rp {transaction.finalPrice.toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="space-y-3">
                    {bankAccounts.map(acc => (
                        <div key={acc.bank} className="p-3 border rounded-md">
                            <p className="font-semibold">{acc.bank}</p>
                            <p className="text-sm text-muted-foreground">{acc.name}</p>
                            <div className="flex justify-between items-center mt-1">
                                <p className="font-mono text-lg">{acc.number}</p>
                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(acc.number, "Nomor Rekening")}>Salin</Button>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">PENTING: Pastikan Anda mentransfer sesuai jumlah total di atas (tanpa pembulatan) agar pembayaran dapat diverifikasi secara otomatis.</p>
            </CardContent>
        </Card>
    );
}