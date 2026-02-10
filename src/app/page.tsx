import { getPatients, getSessions, getBillingEntries } from "@/lib/data";
import { initializeDatabase } from "@/lib/initSheet";
import Link from "next/link";
import { Users, Calendar, Wallet, ArrowRight, UserPlus, Clock } from "lucide-react";
import { Patient, Session, BillingEntry } from "@/lib/types";

// Reusing debt calculation logic
function calculateTotalDebt(patients: Patient[], sessions: Session[], billing: BillingEntry[]) {
  let totalDebt = 0;

  patients.forEach(patient => {
    const patientSessions = sessions.filter(s => s.patientId === patient.id);
    const patientPayments = billing.filter(b => b.patientId === patient.id);

    let totalExpected = 0;

    if (patient.billingType === 'per-session') {
      const attendedSessions = patientSessions.filter(s => s.status === 'attended');
      totalExpected = attendedSessions.length * patient.rate;
    } else {
      const months = new Set(patientSessions.filter(s => s.date).map(s => s.date.substring(0, 7)));
      totalExpected = months.size * patient.rate;
    }

    const totalPaid = patientPayments.reduce((sum, b) => sum + b.amount, 0);
    const debt = totalExpected - totalPaid;
    if (debt > 0) totalDebt += debt;
  });

  return totalDebt;
}

export default async function DashboardPage() {
  await initializeDatabase();

  const patients = await getPatients();
  const sessions = await getSessions();
  const billing = await getBillingEntries();
  const activePatients = patients.filter(p => p.status === 'active');

  // Stats
  const totalDebt = calculateTotalDebt(patients, sessions, billing);

  // Sessions this month
  const currentMonth = new Date().toISOString().substring(0, 7);
  const sessionsThisMonth = sessions.filter(s => s.date && s.date.startsWith(currentMonth) && s.status === 'attended').length;

  return (
    <div className="flex flex-col h-full overflow-hidden" dir="rtl">
      {/* Header - Fixed */}
      <div className="p-4 md:p-8 lg:p-12 pb-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">לוח בקרה ראשי</h1>
        <p className="text-gray-500 mt-2 text-lg font-medium">סקירה כללית של הקליניקה שלך</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 space-y-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">סה"כ מטופלים פעילים</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{activePatients.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">מפגשים החודש</p>
              <p className="text-3xl font-black text-indigo-900 mt-1">{sessionsThisMonth}</p>
            </div>
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Calendar size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">יתרת חוב כוללת</p>
              <p className="text-3xl font-black text-red-600 mt-1">₪{totalDebt}</p>
            </div>
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Wallet size={28} />
            </div>
          </div>
        </div>


        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">פעולות מהירות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/patients" className="group bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-[2rem] shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <UserPlus size={24} />
                </div>
                <h3 className="text-2xl font-bold">מטופל חדש</h3>
                <p className="text-blue-100 mt-1 font-medium">הוספת כרטיס מטופל למערכת</p>
              </div>
              <ArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" size={32} />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </Link>

            <Link href="/sessions" className="group bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:scale-[1.02] transition-all flex justify-between items-center">
              <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                  <Clock size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">תיעוד מפגש</h3>
                <p className="text-gray-500 mt-1 font-medium">רישום נוכחות וסיכום טיפול</p>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-indigo-600 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" size={32} />
            </Link>
          </div>
        </div>

        {/* Recent Activity Mini-Feed */}
        <div className="pb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">עדכונים אחרונים</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            {sessions.slice(0, 3).map(s => {
              const p = patients.find(pat => pat.id === s.patientId);
              return (
                <div key={s.sessionId} className="flex items-center gap-4 text-sm pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <span className="text-gray-500">{s.date}</span>
                  <span className="font-bold text-gray-900">מפגש {s.status === 'attended' ? 'בוצע' : 'בוטל'}</span>
                  <span className="text-gray-500">עבור {p?.name}</span>
                </div>
              )
            })}
            {sessions.length === 0 && <p className="text-gray-400 italic">אין פעילות אחרונה</p>}
          </div>
        </div>
      </div>
    </div>
  );
}