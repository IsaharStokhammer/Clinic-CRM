import { addSession, deleteSession } from "@/lib/actions";
import { getPatients, getSessions } from "@/lib/data";
import { Session, Patient } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText, Home, Lock, Trash2 } from "lucide-react";

export default async function SessionsPage() {
    const patients = await getPatients();
    const activePatients = patients.filter(p => p.status === 'active');
    const sessions = await getSessions();

    // Sort sessions by date (newest first)
    const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-8" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">ניהול מפגשים</h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">תיעוד מפגשים טיפוליים, מעקב נוכחות וניהול יומן</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">מפגשים השבוע</p>
                            <p className="text-2xl font-black text-gray-900">
                                {/* Simple logic: count sessions in this week (approximated for now as last 7 days) */}
                                {sessions.filter(s => {
                                    const date = new Date(s.date);
                                    const now = new Date();
                                    const diffTime = Math.abs(now.getTime() - date.getTime());
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    return diffDays <= 7;
                                }).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Calendar size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Log Session Form */}
                <div className="xl:col-span-7 space-y-6">
                    <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                <Clock size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">תיעוד מפגש חדש</h2>
                        </div>

                        <form action={addSession} className="space-y-6">
                            {/* Patient Selection & Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">בחר מטופל</label>
                                    <select name="patientId" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 input-focus">
                                        <option value="">בחר מטופל...</option>
                                        {activePatients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תאריך</label>
                                        <input type="date" name="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 input-focus" defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שעה</label>
                                        <input type="time" name="startTime" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 input-focus" defaultValue="16:00" />
                                    </div>
                                </div>
                            </div>

                            {/* Duration & Status */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">משך זמן (דקות)</label>
                                    <input type="number" name="duration" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 input-focus" defaultValue="45" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סטטוס הגעה</label>
                                    <select name="status" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 input-focus">
                                        <option value="attended">בוצע</option>
                                        <option value="canceled">בוטל</option>
                                        <option value="missed">לא הגיע</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clinical Notes Section */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <FileText size={18} />
                                    תיעוד קליני
                                </h3>
                                <div className="space-y-2 mb-4">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תוכן הטיפול (מהלך המפגש)</label>
                                    <textarea name="therapyContent" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[120px] input-focus" placeholder="מה נעשה במפגש? נושאים שעלו, התקדמות..."></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide flex items-center gap-1">
                                            <Home size={14} className="text-indigo-400" />
                                            משימות לבית
                                        </label>
                                        <textarea name="homework" className="w-full px-5 py-4 bg-indigo-50/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[100px] input-focus placeholder:text-indigo-300" placeholder="שיעורי בית ותרגול לשבוע הבא"></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide flex items-center gap-1">
                                            <Lock size={14} className="text-amber-400" />
                                            הערות פנימיות (פרטי)
                                        </label>
                                        <textarea name="internalPrivateNotes" className="w-full px-5 py-4 bg-amber-50/50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 min-h-[100px] input-focus placeholder:text-amber-700/30" placeholder="הערות אישיות שלא יוצגו בסיכומים להורים"></textarea>
                                    </div>
                                </div>
                            </div>

                            <SubmitButton>שמירת מפגש ותיעוד</SubmitButton>
                        </form>
                    </section>
                </div>

                {/* Recent Sessions List */}
                <div className="xl:col-span-5">
                    <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden h-fit sticky top-6">
                        <div className="p-8 flex justify-between items-center border-b border-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800">מפגשים אחרונים</h2>
                            <Link href="/sessions/history" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                צפה בהכל
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-50 max-h-[800px] overflow-y-auto">
                            {sortedSessions.slice(0, 10).map((session, index) => {
                                const patient = patients.find(p => p.id === session.patientId);
                                return (
                                    <div key={session.sessionId} className="p-6 hover:bg-indigo-50/30 transition-all flex items-start gap-4 group">
                                        <div className="mt-1">
                                            {session.status === 'attended' ? <CheckCircle size={20} className="text-green-500" /> :
                                                session.status === 'canceled' ? <XCircle size={20} className="text-red-500" /> :
                                                    <AlertCircle size={20} className="text-yellow-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900 text-lg">
                                                    {patient ? patient.name : 'Unknown Patient'}
                                                </h4>
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                                    {session.date}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mt-1">
                                                {session.startTime} • {session.duration} דקות
                                            </p>
                                            <div className="flex justify-between items-center mt-3">
                                                <Link href={`/patients/${session.patientId}`} className="text-xs font-bold text-indigo-600 hover:underline">
                                                    צפה בתיעוד מלא
                                                </Link>

                                                <form action={deleteSession.bind(null, session.sessionId)}>
                                                    <button className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="מחק מפגש">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {sessions.length === 0 && (
                                <div className="p-12 text-center">
                                    <p className="text-gray-400 font-medium italic">אין מפגשים מתועדים עדיין</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
