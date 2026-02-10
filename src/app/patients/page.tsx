import { addPatient, deletePatient } from "@/lib/actions";
import { getPatients } from "@/lib/data";
import { Patient } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";
import Link from "next/link";
import { Phone, Users, Trash2, Edit } from "lucide-react";

export default async function PatientsPage() {
    const patients = await getPatients();
    const activePatients = patients.filter(p => p.status === 'active');

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-8" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">ניהול מטופלים</h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">ניהול רשימת המטופלים, פרטי קשר וסטטוס</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">פעילים</p>
                            <p className="text-2xl font-black text-gray-900">{activePatients.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Users />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Add Patient Form */}
                <div className="xl:col-span-4 space-y-6">
                    <section className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Users size={20} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">מטופל חדש</h2>
                        </div>

                        <form action={addPatient} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שם המטופל</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 input-focus"
                                    placeholder="ישראל ישראלי"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שם הורה</label>
                                <input
                                    type="text"
                                    name="parentName"
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 input-focus"
                                    placeholder="פלוני אלמוני"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">טלפון</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 ltr text-left input-focus"
                                        placeholder="050-0000000"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Phone size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סוג חיוב</label>
                                    <select name="billingType" required className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 input-focus">
                                        <option value="per-session">לפי מפגש</option>
                                        <option value="monthly">חודשי קבוע</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תעריף</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="rate"
                                            required
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 input-focus"
                                            placeholder="250"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₪</span>
                                    </div>
                                </div>
                            </div>

                            <SubmitButton>הוספת מטופל</SubmitButton>
                        </form>
                    </section>
                </div>

                {/* Patients List */}
                <div className="xl:col-span-8">
                    <section className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-8 flex justify-between items-center border-b border-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800">רשימת מטופלים</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                                        <th className="px-8 py-5">מטופל/ת</th>
                                        <th className="px-8 py-5">פרטי קשר</th>
                                        <th className="px-8 py-5">חיוב</th>
                                        <th className="px-8 py-5">פעולות</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activePatients.map((patient: Patient) => (
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
                                                    <Phone size={16} />
                                                    {patient.phone}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-lg font-black text-gray-900">
                                                    {patient.rate}
                                                    <span className="text-gray-400 text-xs font-normal mr-1">₪</span>
                                                </span>
                                                <div className="text-xs text-gray-400 font-medium">
                                                    {patient.billingType === 'monthly' ? 'לחודש' : 'למפגש'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/patients/${patient.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="תיק רפואי">
                                                        <Edit size={18} />
                                                    </Link>
                                                    <form action={deletePatient.bind(null, patient.id)}>
                                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="מחיקה (ארכיון)">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {activePatients.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                                        <Users size={32} />
                                                    </div>
                                                    <p className="text-gray-400 font-bold text-xl italic">לא נמצאו מטופלים פעילים</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
