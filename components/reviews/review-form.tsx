// frontend/components/reviews/review-form.tsx

"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/lib/apihelper"; // Menggunakan path alias

interface ReviewFormProps {
  eventId: string;
  onReviewSubmit: () => void; 
}

export function ReviewForm({ eventId, onReviewSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Rating tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createReview({ eventId, rating, comment });
      alert("Ulasan berhasil dikirim!");
      onReviewSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim ulasan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div>
        <label className="font-medium text-sm">Rating Anda</label>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-7 w-7 cursor-pointer ${
                (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="font-medium text-sm">Ulasan Anda (Opsional)</label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman Anda tentang event ini..."
          className="mt-2"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Kirim Ulasan
      </Button>
    </div>
  );
}