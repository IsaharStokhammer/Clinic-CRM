'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import { updatePatient, deletePatient } from '@/lib/actions';
import { SubmitButton } from './SubmitButton';
import { X, Pencil, Trash2, Phone, User, CreditCard, DollarSign, Activity } from 'lucide-react';

export function EditPatientForm({ patient }: { patient: Patient }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
                <Pencil size={18} />
                <span>עריכת פרטים</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Pencil size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">עריכת פרטי מטופל</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <form action={async (formData) => {
                    await updatePatient(formData);
                    setIsOpen(false);
                }} className="p-8 space-y-6">
                    <input type="hidden" name="id" value={patient.id} />
                    <input type="hidden" name="status" value={patient.status} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">שם המטופל</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={patient.name}
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                                    <User size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">שם הורה</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="parentName"
                                    defaultValue={patient.parentName}
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                                    <User size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">טלפון</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={patient.phone}
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 ltr text-left"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                                    <Phone size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">סטטוס</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={patient.status}
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 appearance-none"
                                >
                                    <option value="active">פעיל</option>
                                    <option value="inactive">לא פעיל</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                    <Activity size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">סוג חיוב</label>
                            <div className="relative">
                                <select
                                    name="billingType"
                                    defaultValue={patient.billingType}
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 appearance-none"
                                >
                                    <option value="per-session">לפי מפגש</option>
                                    <option value="monthly">חודשי קבוע</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                                    <CreditCard size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">תעריף</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="rate"
                                    defaultValue={patient.rate}
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">
                                    ₪
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <div className="flex-1">
                            <SubmitButton>שמירת שינויים</SubmitButton>
                        </div>
                        <button
                            type="button"
                            onClick={async () => {
                                if (confirm('האם אתה בטוח שברצונך להעביר את המטופל לארכיון?')) {
                                    await deletePatient(patient.id);
                                    setIsOpen(false);
                                }
                            }}
                            className="px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={20} />
                            <span>ארכיון</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
