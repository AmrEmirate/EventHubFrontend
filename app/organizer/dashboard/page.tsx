"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Users, DollarSign, Ticket, Plus, Eye, Edit, MoreHorizontal, CheckCircle, XCircle, Clock, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
    getOrganizerStats, getOrganizerTransactions, approveTransaction, rejectTransaction, 
    getMyOrganizerEvents, deleteEvent, getOrganizerAnalytics, // Impor fungsi baru
    OrganizerStats, OrganizerTransaction, Event, AnalyticsData 
} from "../../../lib/apihelper";

// Komponen StatCard dan TransactionStatusBadge tidak berubah

export default function OrganizerDashboard() {
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [transactions, setTransactions] = useState<OrganizerTransaction[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null); // State baru untuk data analitik
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, transactionsRes, eventsRes, analyticsRes] = await Promise.all([
        getOrganizerStats(),
        getOrganizerTransactions(),
        getMyOrganizerEvents(),
        getOrganizerAnalytics(), // Panggil API analitik
      ]);
      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
      setMyEvents(eventsRes.data);
      setAnalytics(analyticsRes.data); // Simpan data analitik
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
      setError("Tidak dapat memuat data. Pastikan Anda adalah seorang organizer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

  // ... (fungsi handleTransactionAction dan handleDeleteEvent tidak berubah)

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">{error}</div>;

  return (
    <>
      <div className="min-h-screen bg-muted/20">
        {/* ... (Header dan Statistik tidak berubah) ... */}
        <div className="container mx-auto px-4 py-8">
            {/* ... */}
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Manajemen Transaksi</TabsTrigger>
                    <TabsTrigger value="events">Event Saya</TabsTrigger>
                    <TabsTrigger value="analytics">Analitik</TabsTrigger>
                </TabsList>

                {/* ... (Tab Transaksi dan Event Saya tidak berubah) ... */}

                <TabsContent value="analytics" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tren Pendapatan Harian</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analytics?.revenuePerDay}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${Number(value) / 1000}k`} />
                                        <Tooltip formatter={(value: number) => formatPrice(value)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#8884d8" name="Pendapatan" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Penjualan Tiket per Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analytics?.ticketsPerEvent}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="eventName" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip formatter={(value: number) => `${value} tiket`} />
                                        <Legend />
                                        <Bar dataKey="sold" fill="#82ca9d" name="Tiket Terjual" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </div>
      {/* ... (AlertDialog tidak berubah) ... */}
    </>
  );
}