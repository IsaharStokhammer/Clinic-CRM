import { getPatientFullData } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SessionTimelineItem } from "@/components/SessionTimelineItem";
import { EditPatientForm } from "@/components/EditPatientForm";
import { AddSessionDialog } from "@/components/AddSessionDialog";
import { AddPaymentDialog } from "@/components/AddPaymentDialog";
import { EditPaymentDialog } from "@/components/EditPaymentDialog";
import { deleteBilling } from "@/lib/actions";
import { Trash2 } from "lucide-react";

// Icons
const ArrowRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getPatientFullData(id);

    if (!data) {
        notFound();
    }

    const { patient, sessions, billing } = data;

    return (
        <div className="flex flex-col h-full overflow-hidden" dir="rtl">
            {/* Action Bar / Navigation - Fixed */}
            <div className="p-4 md:p-8 lg:p-12 pb-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Link href="/patients" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                        <ArrowRight />
                        <span>חזרה לרשימת המטופלים</span>
                    </Link>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-10 flex flex-col lg:flex-row gap-10">
                            {/* Profile Info Side */}
                            <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative group shrink-0">
                                    <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                                        {patient.name[0]}
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer ring-4 ring-white">
                                        <EditPatientForm patient={patient} />
                                    </div>
                                </div>
                                <div className="text-center md:text-right flex-1">
                                    <div className="flex flex-col gap-2 mb-6">
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{patient.name}</h1>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                                            <span className={`px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest ${patient.status === 'active' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-rose-50 text-rose-600 ring-1 ring-rose-100'}`}>
                                                {patient.status === 'active' ? 'מטופל פעיל' : 'לא פעיל'}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest ${patient.billingType === 'monthly' ? 'bg-violet-50 text-violet-600 ring-1 ring-violet-100' : 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100'}`}>
                                                {patient.billingType === 'monthly' ? 'חיוב חודשי' : 'חיוב לפי מפגש'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                                        <div className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">שם הורה</p>
                                                <p className="font-bold text-gray-800">{patient.parentName || 'לא צוין'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">טלפון ליצירת קשר</p>
                                                <p className="font-bold text-gray-800 ltr">{patient.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider for Desktop */}
                            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent" />

                            {/* Financial Stats Side */}
                            <div className="lg:w-80 space-y-4">
                                <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 flex flex-col justify-between h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">סיכום כספי</h3>
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-gray-400">סה"כ לתשלום</span>
                                            <div className="text-left font-black text-gray-900 text-xl">
                                                <span className="text-sm font-normal opacity-40 ml-1">₪</span>
                                                {patient.billingType === 'per-session'
                                                    ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                                    : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate
                                                }
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-gray-400">שולם עד כה</span>
                                            <div className="text-left font-black text-emerald-600 text-xl">
                                                <span className="text-sm font-normal opacity-40 ml-1">₪</span>
                                                {billing.reduce((sum, b) => sum + b.amount, 0)}
                                            </div>
                                        </div>
                                        <div className="h-px bg-gray-200/50 my-2" />
                                        <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
                                                {((patient.billingType === 'per-session'
                                                    ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                                    : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate) -
                                                    billing.reduce((sum, b) => sum + b.amount, 0)) > 0 ? "חוב נוכחי" : "יתרה / עודף"}
                                            </span>
                                            <div className={`text-xl font-black ${((patient.billingType === 'per-session'
                                                ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                                : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate) -
                                                billing.reduce((sum, b) => sum + b.amount, 0)) > 0 ? 'text-rose-600' : 'text-blue-600'
                                                }`}>
                                                <span className="text-sm font-normal opacity-40 ml-1">₪</span>
                                                {Math.abs(
                                                    (patient.billingType === 'per-session'
                                                        ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                                        : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate) -
                                                    billing.reduce((sum, b) => sum + b.amount, 0)
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Footer */}
                        <div className="bg-gray-50/80 border-t border-gray-100 p-4 md:px-10 flex flex-wrap gap-8">
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">מפגשים שבוצעו</div>
                                <div className="text-lg font-black text-gray-900">{sessions.filter(s => s.status === 'attended').length}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">תעריף</div>
                                <div className="text-lg font-black text-gray-900">₪{patient.rate} <span className="text-xs font-medium text-gray-400">{patient.billingType === 'monthly' ? '/ לחודש' : '/ למפגש'}</span></div>
                            </div>
                        </div>
                    </div>


                    {/* Action Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-indigo-600 rounded-3xl p-1 flex items-center shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all group">
                            <div className="flex-1 px-6 py-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                                    <FileTextIcon />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">תיעוד רפואי</p>
                                    <p className="text-white font-bold text-lg">היסטוריה קלינית</p>
                                </div>
                            </div>
                            <AddSessionDialog patientId={id} />
                        </div>

                        <div className="bg-emerald-600 rounded-3xl p-1 flex items-center shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all group">
                            <div className="flex-1 px-6 py-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                                    <ReceiptIcon />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em]">ניהול כספי</p>
                                    <p className="text-white font-bold text-lg">תשלומים וגבייה</p>
                                </div>
                            </div>
                            <AddPaymentDialog patientId={id} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Timeline - Clinical History */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                    ציר זמן טיפולי
                                </h2>
                            </div>

                            <div className="space-y-6 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100 pb-20">
                                {sessions.map((session, index) => (
                                    <SessionTimelineItem key={session.sessionId} session={session} index={index} />
                                ))}

                                {sessions.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <CalendarIcon />
                                        </div>
                                        <p className="text-gray-400 font-medium">טרם תועדו מפגשים עבור מטופל זה</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar - Billing History */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                                    פירוט תקבולים
                                </h2>
                            </div>

                            <div className="bg-white rounded-[2rem] shadow-sm shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">סה"כ שולם במצטבר</div>
                                    <div className="text-3xl font-black text-gray-900">
                                        <span className="text-gray-300 text-lg ml-1 font-normal opacity-50">₪</span>
                                        {billing.reduce((sum, b) => sum + b.amount, 0)}
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {billing.map(payment => (
                                        <div key={payment.paymentId} className="p-6 hover:bg-gray-50 transition-colors group relative">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="font-bold text-gray-900 text-lg">₪{payment.amount}</div>
                                                <div className="text-xs font-bold text-gray-400 ltr">{payment.date}</div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-500 font-medium">{payment.method}</div>
                                                <div className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 rounded-lg font-black uppercase tracking-wider">{payment.monthRef}</div>
                                            </div>
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                                                <EditPaymentDialog payment={payment} />
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await deleteBilling(payment.paymentId);
                                                    }}
                                                >
                                                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-gray-100" title="מחיקת תשלום">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                    {billing.length === 0 && (
                                        <div className="p-12 text-center text-gray-400 font-medium text-sm">
                                            <ReceiptIcon />
                                            <p className="mt-2">לא נמצאו תשלומים</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const ReceiptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5V6.5" /></svg>
);
