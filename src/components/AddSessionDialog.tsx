'use client';

import { useState } from 'react';
import { Plus, X, Clock, FileText, Home, Lock } from 'lucide-react';
import { addSession } from '@/lib/actions';
import { SubmitButton } from './SubmitButton';

export function AddSessionDialog({ patientId }: { patientId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
                <Plus size={18} />
                <span>מפגש חדש</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">תיעוד מפגש חדש</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <form action={async (formData) => {
                    await addSession(formData);
                    setIsOpen(false);
                }} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                    <input type="hidden" name="patientId" value={patientId} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תאריך</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">שעה</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
                                    defaultValue="16:00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">משך זמן (דקות)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
                                    defaultValue="45"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">סטטוס</label>
                                <select
                                    name="status"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 appearance-none"
                                >
                                    <option value="attended">בוצע</option>
                                    <option value="canceled">בוטל</option>
                                    <option value="missed">לא הגיע</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FileText size={18} />
                            תיעוד קליני
                        </h3>
                        <div className="space-y-2 mb-4">
                            <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide">תוכן הטיפול</label>
                            <textarea
                                name="therapyContent"
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[120px]"
                                placeholder="מה נעשה במפגש?"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide flex items-center gap-1">
                                    <Home size={14} className="text-indigo-400" />
                                    משימות לבית
                                </label>
                                <textarea
                                    name="homework"
                                    className="w-full px-5 py-4 bg-indigo-50/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 min-h-[100px]"
                                    placeholder="שיעורי בית"
                                ></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-wide flex items-center gap-1">
                                    <Lock size={14} className="text-amber-400" />
                                    הערות פנימיות
                                </label>
                                <textarea
                                    name="internalPrivateNotes"
                                    className="w-full px-5 py-4 bg-amber-50/50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 min-h-[100px]"
                                    placeholder="לא יוצג להורים"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <SubmitButton>שמירת מפגש ותיעוד</SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
