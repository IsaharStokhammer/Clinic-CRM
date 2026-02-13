export const dynamic = "force-dynamic";

import { getPatients, getSessions, getClinicalNotes } from "@/lib/data";
import { initializeDatabase } from "@/lib/initSheet";
import { SessionCalendar } from "@/components/SessionCalendar";
import { Calendar as CalendarIcon } from "lucide-react";

export default async function CalendarPage() {
    await initializeDatabase();

    const patients = await getPatients();
    const sessions = await getSessions();
    const notes = await getClinicalNotes();

    return (
        <div className="flex flex-col h-full overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="p-4 md:p-8 lg:p-12 pb-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                        <CalendarIcon size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">יומן פגישות</h1>
                        <p className="text-gray-500 mt-1 text-lg font-medium">ניהול ומעקב ויזואלי אחר כל המפגשים השוטפים</p>
                    </div>
                </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-gray-50/30">
                <div className="max-w-7xl mx-auto">
                    <SessionCalendar sessions={sessions} patients={patients} notes={notes} />
                </div>
            </div>
        </div>
    );
}
