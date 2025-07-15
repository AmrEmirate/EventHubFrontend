// frontend/app/organizer/attendees/[eventId]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEventAttendees, Attendee } from "../../../../lib/apihelper";

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { eventId } = params;

  useEffect(() => {
    if (typeof eventId !== "string") return;

    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const response = await getEventAttendees(eventId);
        setAttendees(response.data);
      } catch (err) {
        console.error("Gagal mengambil data peserta:", err);
        setError("Tidak dapat memuat daftar peserta.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("id-ID");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/organizer/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="mr-2 h-6 w-6" />
            Daftar Peserta Event
          </CardTitle>
          <CardDescription>
            Berikut adalah daftar pengguna yang telah berhasil membeli tiket untuk event ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Peserta</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Jumlah Tiket</TableHead>
                  <TableHead>Tanggal Pembelian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.length > 0 ? (
                  attendees.map((att, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{att.user.name}</TableCell>
                      <TableCell>{att.user.email}</TableCell>
                      <TableCell>{att.quantity}</TableCell>
                      <TableCell>{formatDate(att.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center">Belum ada peserta untuk event ini.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}