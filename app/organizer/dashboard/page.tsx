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

// [PERUBAHAN] Impor fungsi dan tipe data yang sudah diperbarui
import { 
    getOrganizerDashboard, 
    approveTransaction, 
    rejectTransaction, 
    deleteEvent,
    getOrganizerTransactions,
    getMyOrganizerEvents,
    OrganizerDashboardData, // Tipe data gabungan yang baru
    OrganizerTransaction,
    Event 
} from "../../../lib/apihelper";

// --- Komponen Tambahan (Helper) ---

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const TransactionStatusBadge = ({ status }: { status: OrganizerTransaction['status'] }) => {
    const statusMap: Record<typeof status, { className: string, icon: React.ElementType, text: string }> = {
      'COMPLETED': { className: "bg-green-100 text-green-800", icon: CheckCircle, text: "Selesai" },
      'PENDING_CONFIRMATION': { className: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Menunggu Konfirmasi" },
      'PENDING_PAYMENT': { className: "bg-blue-100 text-blue-800", icon: Clock, text: "Menunggu Pembayaran" },
      'REJECTED': { className: "bg-red-100 text-red-800", icon: XCircle, text: "Ditolak" },
      'CANCELLED': { className: "bg-gray-100 text-gray-800", icon: XCircle, text: "Dibatalkan" },
      'EXPIRED': { className: "bg-orange-100 text-orange-800", icon: Clock, text: "Kedaluwarsa" },
    };
    const { className, icon: Icon, text } = statusMap[status] || statusMap['CANCELLED'];
    return (
        <Badge variant="outline" className={`border-0 ${className}`}>
            <Icon className="h-3.5 w-3.5 mr-1.5" />
            {text}
        </Badge>
    );
};


// --- Komponen Utama Halaman Dasbor ---

export default function OrganizerDashboard() {
    // [PERUBAHAN] Menggunakan satu state untuk semua data
    const [dashboardData, setDashboardData] = useState<OrganizerDashboardData | null>(null);
    const [transactions, setTransactions] = useState<OrganizerTransaction[]>([]);
    const [myEvents, setMyEvents] = useState<Event[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // [PERUBAHAN] Cukup panggil 3 endpoint
                const [dashboardRes, transactionsRes, eventsRes] = await Promise.all([
                    getOrganizerDashboard(),
                    getOrganizerTransactions(),
                    getMyOrganizerEvents(),
                ]);
                
                // Set data dari masing-masing respons
                setDashboardData(dashboardRes.data);
                setTransactions(transactionsRes.data);
                setMyEvents(eventsRes.data);

            } catch (err: any) {
                console.error("Gagal memuat data dashboard:", err);
                const errorMessage = err.response?.data?.message || "Tidak dapat memuat data. Pastikan Anda adalah seorang organizer.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

    const handleTransactionAction = async (action: 'approve' | 'reject', transactionId: string) => {
        try {
            const actionFunc = action === 'approve' ? approveTransaction : rejectTransaction;
            await actionFunc(transactionId);
            // Muat ulang hanya data transaksi
            const transactionsRes = await getOrganizerTransactions();
            setTransactions(transactionsRes.data);
        } catch (error) {
            console.error(`Gagal ${action} transaksi:`, error);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEventId) return;
        try {
            await deleteEvent(selectedEventId);
            // Muat ulang data event setelah berhasil hapus
            const eventsRes = await getMyOrganizerEvents();
            setMyEvents(eventsRes.data);
        } catch (error) {
            console.error("Gagal menghapus event:", error);
        } finally {
            setShowDeleteDialog(false);
            setSelectedEventId(null);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">{error}</div>;
    }
    
    return (
        <>
            <div className="min-h-screen bg-muted/20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">Dasbor Saya</h1>
                        <Button asChild>
                            <Link href="/organizer/create-event"><Plus className="mr-2 h-4 w-4" /> Buat Event Baru</Link>
                        </Button>
                    </div>

                    {/* [PERUBAHAN] Gunakan data dari dashboardData.stats */}
                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                        <StatCard title="Total Pendapatan" value={formatPrice(dashboardData?.stats?.revenue ?? 0)} icon={DollarSign} />
                        <StatCard title="Tiket Terjual" value={`${dashboardData?.stats?.ticketsSold ?? 0}`} icon={Ticket} />
                        <StatCard title="Total Event Aktif" value={`${dashboardData?.stats?.totalEvents ?? 0}`} icon={Calendar} />
                    </div>

                    <Tabs defaultValue="transactions">
                        <TabsList>
                            <TabsTrigger value="transactions">Manajemen Transaksi</TabsTrigger>
                            <TabsTrigger value="events">Event Saya</TabsTrigger>
                            <TabsTrigger value="analytics">Analitik</TabsTrigger>
                        </TabsList>
                        
                        {/* Tab Content untuk Transaksi */}
                        <TabsContent value="transactions" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaksi Terbaru</CardTitle>
                                    <CardDescription>Kelola dan konfirmasi transaksi dari peserta.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Pembeli</TableHead>
                                                <TableHead>Event</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead>Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.length > 0 ? transactions.map((trx) => (
                                                <TableRow key={trx.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{trx.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">{trx.user.email}</div>
                                                    </TableCell>
                                                    <TableCell>{trx.event.name}</TableCell>
                                                    <TableCell><TransactionStatusBadge status={trx.status} /></TableCell>
                                                    <TableCell className="text-right">{formatPrice(trx.finalPrice)}</TableCell>
                                                    <TableCell>
                                                        {trx.status === 'PENDING_CONFIRMATION' && (
                                                            <div className="flex gap-2">
                                                                <Button size="sm" variant="outline" onClick={() => handleTransactionAction('approve', trx.id)}>Setujui</Button>
                                                                <Button size="sm" variant="destructive" onClick={() => handleTransactionAction('reject', trx.id)}>Tolak</Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={5} className="text-center">Belum ada transaksi.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Content untuk Event Saya */}
                        <TabsContent value="events" className="mt-6">
                            <Card>
                                 <CardHeader>
                                    <CardTitle>Daftar Event Saya</CardTitle>
                                    <CardDescription>Lihat dan kelola semua event yang telah Anda buat.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                   <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama Event</TableHead>
                                                <TableHead>Tanggal Mulai</TableHead>
                                                <TableHead>Tiket Terjual</TableHead>
                                                <TableHead>Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {myEvents.length > 0 ? myEvents.map((event) => (
                                                <TableRow key={event.id}>
                                                    <TableCell className="font-medium">{event.name}</TableCell>
                                                    <TableCell>{formatDate(event.startDate)}</TableCell>
                                                    <TableCell>{event.ticketSold} / {event.ticketTotal}</TableCell>
                                                    <TableCell>
                                                         <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => router.push(`/events/${event.slug}`)}><Eye className="mr-2 h-4 w-4" />Lihat Event</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => router.push(`/organizer/edit-event/${event.id}`)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => router.push(`/organizer/attendees/${event.id}`)}><Users className="mr-2 h-4 w-4" />Lihat Peserta</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedEventId(event.id); setShowDeleteDialog(true); }}>
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={4} className="text-center">Anda belum membuat event.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* [PERUBAHAN] Tab Content untuk Analitik, gunakan data dari dashboardData.analytics */}
                        <TabsContent value="analytics" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader><CardTitle>Tren Pendapatan Harian</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={dashboardData?.analytics?.revenuePerDay}>
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
                                    <CardHeader><CardTitle>Penjualan Tiket per Event</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={dashboardData?.analytics?.ticketsPerEvent}>
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
            
            {/* Dialog konfirmasi hapus (tidak berubah) */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat diurungkan. Ini akan menghapus event secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteEvent} className="bg-red-600 hover:bg-red-700">Ya, Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}