import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default function Loading() {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50/50" dir="rtl">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-100 p-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-gray-100 rounded animate-pulse"></div>
                            <div className="w-24 h-4 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                        <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="bg-gray-100 w-32 h-14 rounded-xl animate-pulse"></div>
                </div>
            </div>

            {/* Filter Bar Skeleton */}
            <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto w-full space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-32 animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
