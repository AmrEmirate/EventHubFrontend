"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createReview } from "@/lib/apihelper";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const reviewSchema = z.object({
  rating: z.number().min(1, { message: "Rating tidak boleh kosong." }).max(5),
  comment: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  eventId: string;
  onReviewSubmit: () => void; 
}

export function ReviewForm({ eventId, onReviewSubmit }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('rating', String(data.rating));
      if (data.comment) {
        formData.append('comment', data.comment);
      }
      if (data.image) {
        formData.append('imageUrl', data.image); // 'imageUrl' harus sama dengan di backend
      }
      
      await createReview(formData);
      toast.success("Ulasan berhasil dikirim!");
      onReviewSubmit();
    } catch (err: any) {
      toast.error("Gagal mengirim ulasan", {
        description: err.response?.data?.message || "Terjadi kesalahan.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <Label>Rating Anda *</Label>
              <FormControl>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        field.value >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <Label>Ulasan Anda (Opsional)</Label>
              <FormControl>
                <Textarea
                  placeholder="Bagikan pengalaman Anda tentang event ini..."
                  className="mt-2"
                  {...field}
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
                <Label>Unggah Foto (Opsional)</Label>
                <FormControl>
                    <div className="relative flex items-center gap-4 rounded-md border border-input p-2 mt-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <Input 
                        type="file" 
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} 
                        accept="image/png, image/jpeg" 
                        className="border-0 shadow-none p-0 h-auto file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Kirim Ulasan
        </Button>
      </form>
    </Form>
  );
}
