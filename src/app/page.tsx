import { addPatient, addSession, addBilling } from "@/lib/actions";
import { getPatients, getSessions, getBillingEntries } from "@/lib/data";
import { initializeDatabase } from "@/lib/initSheet";
import { Patient, Session, BillingEntry } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import { Suspense } from "react";
import Link from "next/link";

// Icons as SVG components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);

const ReceiptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5V6.5" /></svg>
);

function calculateDebt(patient: Patient, sessions: Session[], billing: BillingEntry[]) {
  const patientSessions = sessions.filter(s => s.patientId === patient.id);
  const patientPayments = billing.filter(b => b.patientId === patient.id);

  let totalExpected = 0;
  if (patient.billingType === 'per-session') {
    const attendedSessions = patientSessions.filter(s => s.status === 'attended');
    totalExpected = attendedSessions.length * patient.rate;
  } else {
    // For monthly, we'll estimate based on unique months in sessions or billing
    // Simple heuristic: count unique YYYY-MM from sessions
    const months = new Set(patientSessions.map(s => s.date.substring(0, 7))); // YYYY-MM
    totalExpected = months.size * patient.rate;
  }

  const totalPaid = patientPayments.reduce((sum, b) => sum + b.amount, 0);
  return totalExpected - totalPaid;
}

export default async function DashboardPage() {
  // Ensure database structure is ready
  await initializeDatabase();

  const patients = await getPatients();
  const sessions = await getSessions();
  const billing = await getBillingEntries();

  const totalDebt = patients.reduce((sum, p) => sum + calculateDebt(p, sessions, billing), 0);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-l border-gray-100 p-6 space-y-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            C
          </div>
          <span className="font-bold text-xl text-gray-900 leading-none">ClinicCRM</span>
        </div>
        <nav className="space-y-1">
          <a href="#patients" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium transition-all">
            <UserIcon />
            מטופלים
          </a>
          <a href="#sessions" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all font-inter">
            <CalendarIcon />
            מפגשים
          </a>
          <a href="#billing" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
            <ReceiptIcon />
            חיובים ותשלומים
          </a>
          <a href="#debt" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-all">
            <WalletIcon />
            יתרת חוב
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Header & Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" id="overview">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">ניהול קליניקה</h1>
              <p className="text-gray-500 mt-2 text-lg font-medium">ברוך הבא למערכת ניהול המטופלים שלך</p>
            </div>

            <div className="grid grid-cols-2 md:flex gap-4">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[160px]">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <UserIcon />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">מטופלים</p>
                  <p className="text-2xl font-black text-gray-900">{patients.length}</p>
                </div>
              </div>

              <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[160px]">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                  <WalletIcon />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">יתרת חוב</p>
                  <p className="text-2xl font-black text-red-600">₪{totalDebt}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Main Form Section - Add Patient */}
            <div className="xl:col-span-4 space-y-8" id="patients">
              <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">מטופל חדש</h2>
                </div>

                <form action={addPatient} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שם המטופל</label>
                    <input type="text" name="name" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900" placeholder="ישראל ישראלי" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שם הורה (במידת הצורך)</label>
                    <input type="text" name="parentName" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900" placeholder="פלוני אלמוני" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">טלפון</label>
                    <div className="relative">
                      <input type="tel" name="phone" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 ltr text-left" placeholder="050-0000000" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <PhoneIcon />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סוג חיוב</label>
                      <select name="billingType" required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900">
                        <option value="per-session">לפי מפגש</option>
                        <option value="monthly">חודשי קבוע</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תעריף</label>
                      <div className="relative">
                        <input type="number" name="rate" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900" placeholder="250" />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
                      </div>
                    </div>
                  </div>

                  <SubmitButton>הוספת מטופל</SubmitButton>
                </form>
              </section>
            </div>

            {/* List Sections */}
            <div className="xl:col-span-8 space-y-10">
              {/* Patients List */}
              <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 flex justify-between items-center border-b border-gray-50">
                  <h2 className="text-2xl font-bold text-gray-800">רשימת מטופלים</h2>
                  <div className="text-sm text-gray-400 font-medium">סה"כ: {patients.length}</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <th className="px-8 py-5">מטופל/ת</th>
                        <th className="px-8 py-5">פרטי קשר</th>
                        <th className="px-8 py-5">יתרת חוב</th>
                        <th className="px-8 py-5">סטטוס</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {patients.map((patient: Patient) => {
                        const debt = calculateDebt(patient, sessions, billing);
                        return (
                          <tr key={patient.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                            <td className="px-8 py-6">
                              <Link href={`/patients/${patient.id}`} className="flex items-center gap-4 group/item">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover/item:scale-110">
                                  {patient.name[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-lg leading-tight group-hover/item:text-blue-600 transition-colors">{patient.name}</p>
                                  <p className="text-sm text-gray-400 font-medium">{patient.parentName}</p>
                                </div>
                              </Link>
                            </td>
                            <td className="px-8 py-6 text-gray-600 font-semibold ltr text-left">
                              <div className="flex items-center gap-2">
                                <PhoneIcon />
                                {patient.phone}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`text-xl font-black ${debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                <span className="text-gray-300 text-sm ml-1 font-normal">₪</span>
                                {debt}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {patient.status === 'active' ? 'פעיל' : 'לא פעיל'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Log Session Form */}
              <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100" id="sessions">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <CalendarIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">תיעוד מפגש חדש</h2>
                </div>

                <form action={addSession} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">בחר מטופל</label>
                      <select name="patientId" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900">
                        <option value="">בחר מטופל...</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תאריך</label>
                        <input type="date" name="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שעה</label>
                        <input type="time" name="startTime" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900" defaultValue="16:00" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">משך זמן (דקות)</label>
                      <input type="number" name="duration" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900" defaultValue="45" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סטטוס הגעה</label>
                      <select name="status" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900">
                        <option value="attended">בוצע</option>
                        <option value="canceled">בוטל</option>
                        <option value="missed">לא הגיע</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תוכן הטיפול</label>
                    <textarea name="therapyContent" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[100px]" placeholder="מה נעשה במפגש?"></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">משימות לבית</label>
                      <textarea name="homework" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[80px]" placeholder="שיעורי בית ותרגול"></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">הערות פנימיות (פרטי)</label>
                      <textarea name="internalPrivateNotes" className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[80px]" placeholder="הערות שלא יוצגו להורים"></textarea>
                    </div>
                  </div>

                  <SubmitButton>שמירת מפגש ותיעוד</SubmitButton>
                </form>
              </section>

              {/* Billing Form */}
              <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100" id="billing">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                    <ReceiptIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">תיעוד תשלום</h2>
                </div>

                <form action={addBilling} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">מטופל</label>
                      <select name="patientId" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900">
                        <option value="">בחר מטופל...</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תאריך תשלום</label>
                      <input type="date" name="date" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סכום</label>
                      <div className="relative">
                        <input type="number" name="amount" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900" placeholder="500" />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">אמצעי תשלום</label>
                      <select name="method" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900">
                        <option value="Bit">Bit</option>
                        <option value="PayBox">PayBox</option>
                        <option value="העברה בנקאית">העברה בנקאית</option>
                        <option value="מזומן">מזומן</option>
                        <option value="כרטיס אשראי">כרטיס אשראי</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">עבור חודש</label>
                      <input type="month" name="monthRef" required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-medium text-gray-900" defaultValue={new Date().toISOString().substring(0, 7)} />
                    </div>
                  </div>

                  <SubmitButton>רישום תשלום</SubmitButton>
                </form>
              </section>

              {/* Debt Dashboard (Outstanding only) */}
              <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden" id="debt">
                <div className="p-8 bg-red-50/50 border-b border-red-100 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-red-800 flex items-center gap-3">
                    <WalletIcon />
                    מטופלים בחוב
                  </h2>
                  <div className="text-sm text-red-600 font-bold uppercase tracking-wider">מעקב יתרות</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <th className="px-8 py-5">מטופל והורה</th>
                        <th className="px-8 py-5">סוג חיוב</th>
                        <th className="px-8 py-5">סה"כ חוב</th>
                        <th className="px-8 py-5">פעולה</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {patients.filter(p => calculateDebt(p, sessions, billing) > 0).map(p => {
                        const debt = calculateDebt(p, sessions, billing);
                        return (
                          <tr key={p.id} className="hover:bg-red-50/20 transition-all cursor-default group">
                            <td className="px-8 py-6 font-bold text-gray-900 text-right">
                              <Link href={`/patients/${p.id}`} className="hover:text-red-600 transition-colors">
                                {p.name} ({p.parentName})
                              </Link>
                            </td>
                            <td className="px-8 py-6 text-gray-500 font-medium">{p.billingType === 'monthly' ? 'חודשי' : 'מפגש'}</td>
                            <td className="px-8 py-6">
                              <span className="text-red-600 font-black text-xl">₪{debt}</span>
                            </td>
                            <td className="px-8 py-6">
                              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors">שלח תזכורת</button>
                            </td>
                          </tr>
                        );
                      })}
                      {patients.filter(p => calculateDebt(p, sessions, billing) > 0).length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic font-medium">אין מטופלים עם יתרת חוב כרגע. כל הכבוד!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}