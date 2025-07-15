"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createReview } from '@/lib/apihelper';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ReviewForm({ eventId, onReviewSubmit }: { eventId: string, onReviewSubmit: () => void }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setLoading(true);
    try {
      await createReview({ ...data, eventId });
      toast.success("Ulasan berhasil dikirim!");
      onReviewSubmit(); // Panggil fungsi untuk refresh data
    } catch (err: any) {
      toast.error("Gagal mengirim ulasan", { description: err.response?.data?.message || "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Di sini Anda bisa tambahkan komponen rating bintang jika mau */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ulasan Anda</FormLabel>
              <FormControl>
                <Textarea placeholder="Bagaimana pengalaman Anda di event ini?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Kirim Ulasan
        </Button>
      </form>
    </Form>
  );
}