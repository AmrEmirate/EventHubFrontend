import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { UserProfile } from "@/lib/apihelper";

export default function PointsTab({ user }: { user: UserProfile | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Poin Saya</CardTitle>
        <CardDescription>Kumpulkan poin dan tukarkan untuk diskon di transaksi berikutnya.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-6">
        <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
          <Award className="h-10 w-10" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Poin Anda Saat Ini</p>
          <p className="text-5xl font-bold">{user?.points?.toLocaleString('id-ID') || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}