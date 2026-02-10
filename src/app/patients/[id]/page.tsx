import { getPatientFullData } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SessionTimelineItem } from "@/components/SessionTimelineItem";
import { EditPatientForm } from "@/components/EditPatientForm";
import { AddSessionDialog } from "@/components/AddSessionDialog";
import { AddPaymentDialog } from "@/components/AddPaymentDialog";
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
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12" dir="rtl">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Navigation */}
                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                    <ArrowRight />
                    <span>חזרה לדף הראשי</span>
                </Link>

                {/* Header Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shrink-0">
                            {patient.name[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-1">
                                <h1 className="text-3xl font-black text-gray-900">{patient.name}</h1>
                                <EditPatientForm patient={patient} />
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 font-medium">
                                <p className="flex items-center gap-2">שם הורה: {patient.parentName || 'לא צוין'}</p>
                                <p className="flex items-center gap-2 ltr">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    {patient.phone}
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${patient.billingType === 'monthly' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {patient.billingType === 'monthly' ? 'חיוב חודשי' : 'חיוב לפי מפגש'}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${patient.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {patient.status === 'active' ? 'פעיל' : 'לא פעיל'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Table */}
                    <div className="w-full lg:w-auto bg-gray-50/50 rounded-[1.5rem] p-6 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-0 sm:divide-x sm:divide-x-reverse divide-gray-200">
                            <div className="text-center sm:px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ביקורים</p>
                                <p className="text-2xl font-black text-gray-900">{sessions.filter(s => s.status === 'attended').length}</p>
                            </div>
                            <div className="text-center sm:px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">סך הכל מחיר</p>
                                <p className="text-2xl font-black text-gray-900">
                                    <span className="text-sm font-normal text-gray-400 ml-0.5">₪</span>
                                    {patient.billingType === 'per-session'
                                        ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                        : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate
                                    }
                                </p>
                            </div>
                            <div className="text-center sm:px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">סך הכל שולם</p>
                                <p className="text-2xl font-black text-green-600">
                                    <span className="text-sm font-normal text-green-400 ml-0.5">₪</span>
                                    {billing.reduce((sum, b) => sum + b.amount, 0)}
                                </p>
                            </div>
                            <div className="text-center sm:px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">לתשלום</p>
                                <p className={`text-2xl font-black ${((patient.billingType === 'per-session'
                                    ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                    : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate) -
                                    billing.reduce((sum, b) => sum + b.amount, 0)) > 0 ? 'text-red-600' : 'text-gray-900'
                                    }`}>
                                    <span className="text-sm font-normal opacity-50 ml-0.5">₪</span>
                                    {Math.max(0, (
                                        (patient.billingType === 'per-session'
                                            ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                            : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate) -
                                        billing.reduce((sum, b) => sum + b.amount, 0)
                                    ))}
                                </p>
                            </div>
                            <div className="text-center sm:px-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">עודף</p>
                                <p className="text-2xl font-black text-blue-600">
                                    <span className="text-sm font-normal text-blue-300 ml-0.5">₪</span>
                                    {Math.max(0, (
                                        billing.reduce((sum, b) => sum + b.amount, 0) -
                                        (patient.billingType === 'per-session'
                                            ? sessions.filter(s => s.status === 'attended').length * patient.rate
                                            : new Set(sessions.map(s => s.date.substring(0, 7))).size * patient.rate)
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Timeline - Clinical History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <FileTextIcon />
                                היסטוריה קלינית ותיעוד
                            </h2>
                            <AddSessionDialog patientId={id} />
                        </div>

                        <div className="space-y-6 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                            {sessions.map((session, index) => (
                                <SessionTimelineItem key={session.sessionId} session={session} index={index} />
                            ))}

                            {sessions.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
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
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <ReceiptIcon />
                                היסטוריית תשלומים
                            </h2>
                            <AddPaymentDialog patientId={id} />
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                <div className="text-sm font-bold text-gray-400 uppercase mb-1">סיכום תשלומים</div>
                                <div className="text-2xl font-black text-gray-900">
                                    <span className="text-gray-300 text-lg ml-1 font-normal">₪</span>
                                    {billing.reduce((sum, b) => sum + b.amount, 0)}
                                </div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {billing.map(payment => (
                                    <div key={payment.paymentId} className="p-6 hover:bg-gray-50 transition-colors group relative">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="font-bold text-gray-900">₪{payment.amount}</div>
                                            <div className="text-xs font-bold text-gray-400 ltr">{payment.date}</div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">{payment.method}</div>
                                            <div className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold">{payment.monthRef}</div>
                                        </div>
                                        <form
                                            action={async () => {
                                                'use server';
                                                await deleteBilling(payment.paymentId);
                                            }}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </div>
                                ))}
                                {billing.length === 0 && (
                                    <div className="p-8 text-center text-gray-400 italic text-sm">לא נמצאו תשלומים</div>
                                )}
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
