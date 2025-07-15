"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/lib/apihelper';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function VerificationComponent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Sedang memverifikasi email Anda...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token verifikasi tidak ditemukan.');
            return;
        }

        const doVerification = async () => {
            try {
                const res = await verifyEmail(token);
                setStatus('success');
                setMessage(res.data.message);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Terjadi kesalahan saat verifikasi.');
            }
        };

        doVerification();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />}
            {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500 mb-4" />}
            {status === 'error' && <XCircle className="h-12 w-12 text-red-500 mb-4" />}
            
            <h1 className="text-2xl font-bold mb-2">{message}</h1>
            
            {status === 'success' && (
                <p className="text-muted-foreground mb-6">Anda sekarang dapat login ke akun Anda.</p>
            )}
            {status === 'error' && (
                <p className="text-muted-foreground mb-6">Silakan coba lagi atau hubungi dukungan jika masalah berlanjut.</p>
            )}

            <Button asChild>
                <Link href="/auth/login">Ke Halaman Login</Link>
            </Button>
        </div>
    );
}

// Gunakan Suspense untuk memastikan useSearchParams bisa bekerja
export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationComponent />
        </Suspense>
    );
}