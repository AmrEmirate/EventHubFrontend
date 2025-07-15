"use client";

import { useEffect, useState } from 'react';
import { getPointPrizes, redeemPointPrize } from '@/lib/apihelper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PointPrize {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
}

export default function RedeemPointsPage() {
  const [prizes, setPrizes] = useState<PointPrize[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPrizes = async () => {
    try {
      const res = await getPointPrizes();
      setPrizes(res.data);
    } catch (error) {
      console.error("Gagal memuat hadiah:", error);
      toast.error("Gagal memuat daftar hadiah.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const handleRedeem = async (prize: PointPrize) => {
    if (!user) {
      toast.error("Anda harus login untuk menukar poin.");
      return;
    }
    if (user.points < prize.pointsRequired) {
      toast.warning("Poin Anda tidak cukup.");
      return;
    }
    
    setRedeemingId(prize.id);
    try {
      const res = await redeemPointPrize(prize.id);
      toast.success("Berhasil!", { description: `Anda berhasil menukar poin dengan ${prize.name}. Cek kupon Anda!` });
      // Refresh data (opsional, bisa dengan me-refetch data user di context)
      fetchPrizes(); 
    } catch (err: any) {
      toast.error("Gagal menukar poin", { description: err.response?.data?.message || "Terjadi kesalahan." });
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Tukar Poin</h1>
        <p className="text-muted-foreground">Gunakan poin yang sudah Anda kumpulkan untuk mendapatkan hadiah menarik!</p>
        <p className="text-lg font-semibold mt-2">Poin Anda saat ini: {user?.points?.toLocaleString() || 0}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize) => (
          <Card key={prize.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Award /> {prize.name}</CardTitle>
              <CardDescription>{prize.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <div className="mb-4">
                <p className="text-2xl font-bold text-primary">{prize.pointsRequired.toLocaleString()} Poin</p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handleRedeem(prize)} 
                disabled={redeemingId === prize.id || (user ? user.points < prize.pointsRequired : true)}
              >
                {redeemingId === prize.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tukar Sekarang
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}