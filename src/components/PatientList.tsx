'use client';

import { useState } from 'react';
import { Search, Phone, Edit, Trash2, Users } from 'lucide-react';
import { Patient } from '@/lib/types';
import Link from 'next/link';
import { deletePatient } from '@/lib/actions';

export function PatientList({ initialPatients }: { initialPatients: Patient[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPatients = initialPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.parentName && patient.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        patient.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="חיפוש מטופל לפי שם, שם הורה או טלפון..."
                    className="w-full px-12 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 font-medium text-gray-900 input-focus"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={20} />
                </div>
            </div>

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
                            {filteredPatients.map((patient: Patient) => (
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
                                            <form action={async () => {
                                                if (confirm('האם אתה בטוח שברצונך להעביר לארכיון?')) {
                                                    await deletePatient(patient.id);
                                                }
                                            }}>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="מחיקה (ארכיון)">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                                <Users size={32} />
                                            </div>
                                            <p className="text-gray-400 font-bold text-xl italic">לא נמצאו מטופלים העונים לחיפוש</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
