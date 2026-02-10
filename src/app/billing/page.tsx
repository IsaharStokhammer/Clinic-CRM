import { addBilling } from "@/lib/actions";
import { getPatients, getSessions, getBillingEntries } from "@/lib/data";
import { Patient, Session, BillingEntry } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { CreditCard, Wallet, AlertTriangle, CheckSquare, PlusCircle } from "lucide-react";

function calculateDebt(patient: Patient, sessions: Session[], billing: BillingEntry[]) {
    const patientSessions = sessions.filter(s => s.patientId === patient.id);
    const patientPayments = billing.filter(b => b.patientId === patient.id);

    let totalExpected = 0;
    if (patient.billingType === 'per-session') {
        const attendedSessions = patientSessions.filter(s => s.status === 'attended');
        totalExpected = attendedSessions.length * patient.rate;
    } else {
        // For monthly, count unique months from sessions
        const months = new Set(patientSessions.map(s => s.date.substring(0, 7))); // YYYY-MM
        totalExpected = months.size * patient.rate;
    }

    const totalPaid = patientPayments.reduce((sum, b) => sum + b.amount, 0);
    return totalExpected - totalPaid;
}

export default async function BillingPage() {
    const patients = await getPatients();
    const sessions = await getSessions();
    const billingEntries = await getBillingEntries();

    // Sort billing (newest first)
    const sortedBilling = billingEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate total outstanding debt
    const totalDebt = patients.reduce((sum, p) => sum + Math.max(0, calculateDebt(p, sessions, billingEntries)), 0);

    return (
        <div className="flex flex-col h-full overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="p-4 md:p-8 lg:p-12 pb-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">ניהול כספים</h1>
                        <p className="text-gray-500 mt-2 text-lg font-medium">מעקב תשלומים, יתרות חוב ודוחות כספיים</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-red-500">
                            <div className="text-left">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">סה"כ חוב פתוח</p>
                                <p className="text-2xl font-black text-red-600">₪{totalDebt}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                    <div className="xl:col-span-8 space-y-8">
                        {/* Debt Dashboard */}
                        <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-8 bg-red-50/50 border-b border-red-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-red-800 flex items-center gap-3">
                                    <Wallet size={24} />
                                    מטופלים בחוב
                                </h2>
                                <div className="text-sm text-red-600 font-bold uppercase tracking-wider">נדרש טיפול</div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-right border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                            <th className="px-8 py-5">מטופל</th>
                                            <th className="px-8 py-5">סוג חיוב</th>
                                            <th className="px-8 py-5">חוב</th>
                                            <th className="px-8 py-5">פעולה</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {patients.filter(p => calculateDebt(p, sessions, billingEntries) > 0).map(p => {
                                            const debt = calculateDebt(p, sessions, billingEntries);
                                            return (
                                                <tr key={p.id} className="hover:bg-red-50/20 transition-all cursor-default">
                                                    <td className="px-8 py-6 font-bold text-gray-900">
                                                        <Link href={`/patients/${p.id}`} className="hover:text-red-600 hover:underline">
                                                            {p.name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-8 py-6 text-gray-500 font-medium">
                                                        {p.billingType === 'monthly' ? 'חודשי' : 'מפגש'}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-red-600 font-black text-xl">₪{debt}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">
                                                            שלח תזכורת
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {patients.filter(p => calculateDebt(p, sessions, billingEntries) > 0).length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic font-medium">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <CheckSquare size={32} className="text-green-400" />
                                                        <span>אין מטופלים עם יתרת חוב כרגע. מצוין!</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Recent Payments List */}
                        <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-8 flex justify-between items-center border-b border-gray-50">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <CreditCard size={24} className="text-gray-400" />
                                    תשלומים אחרונים
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                                {sortedBilling.map(payment => {
                                    const patient = patients.find(p => p.id === payment.patientId);
                                    return (
                                        <div key={payment.paymentId} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                                                    ₪
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{patient?.name}</p>
                                                    <p className="text-xs text-gray-400">{payment.date} • {payment.method}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-green-600 text-lg">+₪{payment.amount}</p>
                                                <p className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded inline-block">עבור {payment.monthRef}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Log Payment Form */}
                    <div className="xl:col-span-4 space-y-6">
                        <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                    <PlusCircle size={20} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">תיעוד תשלום</h2>
                            </div>

                            <form action={addBilling} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">מטופל</label>
                                    <select name="patientId" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900 input-focus">
                                        <option value="">בחר מטופל...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תאריך תשלום</label>
                                    <input type="date" name="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900 input-focus" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סכום לתשלום</label>
                                    <div className="relative">
                                        <input type="number" name="amount" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900 input-focus" placeholder="500" />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">אמצעי תשלום</label>
                                    <select name="method" required defaultValue="מזומן" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900 input-focus">
                                        <option value="מזומן">מזומן</option>
                                        <option value="Bit">Bit</option>
                                        <option value="PayBox">PayBox</option>
                                        <option value="העברה בנקאית">העברה בנקאית</option>
                                        <option value="כרטיס אשראי">כרטיס אשראי</option>
                                        <option value="אחר">אחר</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">עבור חודש</label>
                                    <input type="month" name="monthRef" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900 input-focus" defaultValue={new Date().toISOString().substring(0, 7)} />
                                </div>

                                <SubmitButton>רישום תשלום</SubmitButton>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
