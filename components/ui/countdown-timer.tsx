"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Timer } from 'lucide-react';

const calculateTimeLeft = (deadline: string) => {
    const difference = +new Date(deadline) - +new Date();
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return timeLeft;
};

export default function CountdownTimer({ deadline }: { deadline: string }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(deadline));
        }, 1000);
        return () => clearTimeout(timer);
    });

    const hasTimeLeft = timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

    return (
        <div>
            {hasTimeLeft ? (
                 <Badge variant="destructive" className="animate-pulse">
                    <Timer className="h-3.5 w-3.5 mr-1.5" />
                    Bayar Sebelum: {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                </Badge>
            ) : (
                <Badge variant="outline">Waktu Habis</Badge>
            )}
        </div>
    );
}