'use client';

import { useState } from 'react';
import { Plus, X, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { addBilling } from '@/lib/actions';
import { SubmitButton } from './SubmitButton';

export function AddPaymentDialog({ patientId }: { patientId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg hover:scale-105 active:scale-95 transition-all mr-2 group/btn"
                title="תשלום חדש"
            >
                <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-300" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">הוספת תשלום</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <form action={async (formData) => {
                    await addBilling(formData);
                    setIsOpen(false);
                }} className="p-8 space-y-6">
                    <input type="hidden" name="patientId" value={patientId} />

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">תאריך</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-gray-900"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">סכום</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="amount"
                                        required
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-gray-900"
                                        placeholder="0"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₪</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">אמצעי תשלום</label>
                            <select
                                name="method"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-gray-900 appearance-none"
                            >
                                <option value="מזומן">מזומן</option>
                                <option value="ביט / פייבוקס">ביט / פייבוקס</option>
                                <option value="העברה בנקאית">העברה בנקאית</option>
                                <option value="אשראי">אשראי</option>
                                <option value="אחר">אחר</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">שיוך לחודש</label>
                            <input
                                type="month"
                                name="monthRef"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-gray-900"
                                defaultValue={new Date().toISOString().substring(0, 7)}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <SubmitButton>הוספת תשלום</SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
