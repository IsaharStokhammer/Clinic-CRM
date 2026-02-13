export const dynamic = "force-dynamic";

import { getPatients, getSessions, getClinicalNotes } from "@/lib/data";
import { Session, Patient, ClinicalNote } from "@/lib/types";
import Link from "next/link";
import {
    Calendar,
    User,
    Filter,
    Search,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    FileText,
    ArrowUpDown
} from "lucide-react";

interface HistoryPageProps {
    searchParams: Promise<{
        page?: string;
        patientId?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
    }>;
}

export default async function SessionsHistoryPage({ searchParams }: HistoryPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const pageSize = 15;

    // Fetch data
    const [patients, allSessions, allNotes] = await Promise.all([
        getPatients(),
        getSessions(),
        getClinicalNotes()
    ]);

    // Apply Filters
    let filteredSessions = [...allSessions];

    if (params.patientId) {
        filteredSessions = filteredSessions.filter(s => s.patientId === params.patientId);
    }

    if (params.status) {
        filteredSessions = filteredSessions.filter(s => s.status === params.status);
    }

    if (params.startDate) {
        filteredSessions = filteredSessions.filter(s => s.date >= params.startDate!);
    }

    if (params.endDate) {
        filteredSessions = filteredSessions.filter(s => s.date <= params.endDate!);
    }

    // Sort
    const sort = params.sort || "date_desc";
    filteredSessions.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`).getTime();
        const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`).getTime();

        if (sort === "date_asc") return dateA - dateB;
        if (sort === "date_desc") return dateB - dateA;
        return 0;
    });

    // Pagination
    const totalSessions = filteredSessions.length;
    const totalPages = Math.ceil(totalSessions / pageSize);
    const paginatedSessions = filteredSessions.slice((page - 1) * pageSize, page * pageSize);

    // Map sessions with notes and patient names
    const enrichedSessions = paginatedSessions.map(s => ({
        ...s,
        patient: patients.find(p => p.id === s.patientId),
        note: allNotes.find(n => n.sessionId === s.sessionId)
    }));

    const statusMap = {
        attended: { label: "בוצע", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
        canceled: { label: "בוטל", color: "text-red-600", bg: "bg-red-50", icon: XCircle },
        missed: { label: "לא הגיע", color: "text-amber-600", bg: "bg-amber-50", icon: AlertCircle },
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50/50" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/sessions" className="text-gray-400 hover:text-indigo-600 p-1 -mr-2 transition-colors">
                                <ArrowLeft size={20} className="transform rotate-180" />
                            </Link>
                            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">ניהול מפגשים</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">היסטוריית מפגשים</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">סה"כ תוצאות</p>
                                <p className="text-lg font-black text-indigo-900 leading-none">{totalSessions}</p>
                            </div>
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                                <Clock size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 z-20">
                <form className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">מטופל</label>
                            <select
                                name="patientId"
                                defaultValue={params.patientId || ""}
                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="">כל המטופלים</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">סטטוס</label>
                            <select
                                name="status"
                                defaultValue={params.status || ""}
                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="">כל הסטטוסים</option>
                                <option value="attended">בוצע</option>
                                <option value="canceled">בוטל</option>
                                <option value="missed">לא הגיע</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">מתאריך</label>
                            <input
                                type="date"
                                name="startDate"
                                defaultValue={params.startDate || ""}
                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">מיון</label>
                            <select
                                name="sort"
                                defaultValue={params.sort || "date_desc"}
                                className="bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="date_desc">החדש ביותר</option>
                                <option value="date_asc">הישן ביותר</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end gap-2 text-nowrap mt-4 lg:mt-0">
                        <button type="submit" className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                            <Filter size={18} />
                            סנן
                        </button>
                        {(params.patientId || params.status || params.startDate || params.endDate) && (
                            <Link
                                href="/sessions/history"
                                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-all border border-gray-200 shadow-sm"
                                title="נקה סינונים"
                            >
                                <XCircle size={18} />
                            </Link>
                        )}
                        <Link
                            href="/sessions"
                            className="mr-2 px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Clock size={18} />
                            תיעוד חדש
                        </Link>
                    </div>

                    {/* Preserve page hiddenly or reset to 1 on filter change */}
                    <input type="hidden" name="page" value="1" />
                </form>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto w-full space-y-4">
                    {enrichedSessions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {enrichedSessions.map((session, index) => {
                                const status = statusMap[session.status as keyof typeof statusMap] || statusMap.attended;
                                const StatusIcon = status.icon;

                                return (
                                    <div
                                        key={session.sessionId}
                                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                                            {/* Date & Time */}
                                            <div className="flex flex-row lg:flex-col items-center lg:items-center justify-center bg-gray-50 rounded-2xl p-4 min-w-[100px] gap-2 lg:gap-0">
                                                <span className="text-xl font-black text-gray-900 leading-tight">
                                                    {session.date.split('-')[2]}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(session.date).toLocaleDateString('he-IL', { month: 'short' })}
                                                </span>
                                                <div className="w-full h-px bg-gray-200 my-1 hidden lg:block"></div>
                                                <span className="text-xs font-bold text-indigo-600">
                                                    {session.startTime}
                                                </span>
                                            </div>

                                            {/* Patient & Status */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {session.patient?.name || 'מטופל לא נמצא'}
                                                    </h3>
                                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.color} border border-${status.color === 'text-green-600' ? 'green' : status.color === 'text-red-600' ? 'red' : 'amber'}-100`}>
                                                        <StatusIcon size={14} />
                                                        <span className="text-[11px] font-black uppercase tracking-wider">{status.label}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={16} className="text-gray-300" />
                                                        <span>משך: {session.duration} דקות</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={16} className="text-gray-300" />
                                                        <span>{session.patient?.phone || 'ללא טלפון'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Notes Preview */}
                                            <div className="hidden xl:block flex-1 max-w-md">
                                                {session.note?.therapyContent ? (
                                                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex gap-3 line-clamp-2 italic text-sm text-indigo-700/80">
                                                        <FileText size={16} className="shrink-0 mt-0.5" />
                                                        <p className="line-clamp-2">{session.note.therapyContent}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-300 italic">אין תיעוד רשום</p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                                <Link
                                                    href={`/patients/${session.patientId}?sessionId=${session.sessionId}`}
                                                    className="flex-1 lg:flex-none px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                                                >
                                                    לתיעוד ומעקב
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">לא נמצאו מפגשים</h3>
                            <p className="text-gray-500 font-medium">נסה לשנות את מסנני החיפוש או לבחור טווח תאריכים אחר</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white border-t border-gray-100 p-4 md:px-12 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500 hidden md:block">
                        מציג {(page - 1) * pageSize + 1} עד {Math.min(page * pageSize, totalSessions)} מתוך {totalSessions} תוצאות
                    </div>

                    <div className="flex items-center gap-2 mx-auto md:mx-0">
                        <Link
                            href={page > 1 ? `?${new URLSearchParams({ ...params as any, page: (page - 1).toString() })}` : "#"}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 transition-all ${page > 1 ? 'hover:bg-indigo-50 hover:border-indigo-100 text-indigo-600' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
                        >
                            <ChevronRight size={20} />
                        </Link>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <Link
                                    key={p}
                                    href={`?${new URLSearchParams({ ...params as any, page: p.toString() })}`}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${p === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-gray-50 text-gray-500 border border-transparent'}`}
                                >
                                    {p}
                                </Link>
                            )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
                        </div>

                        <Link
                            href={page < totalPages ? `?${new URLSearchParams({ ...params as any, page: (page + 1).toString() })}` : "#"}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 transition-all ${page < totalPages ? 'hover:bg-indigo-50 hover:border-indigo-100 text-indigo-600' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
                        >
                            <ChevronLeft size={20} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
