'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function SessionScroller() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    useEffect(() => {
        if (sessionId) {
            const element = document.getElementById(`session-${sessionId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('ring-4', 'ring-indigo-200', 'bg-indigo-50/50');
                setTimeout(() => {
                    element.classList.remove('ring-4', 'ring-indigo-200', 'bg-indigo-50/50');
                }, 3000);
            }
        }
    }, [sessionId]);

    return null;
}
