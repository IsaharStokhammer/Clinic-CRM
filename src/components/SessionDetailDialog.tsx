'use client';

import { X, Clock, FileText, Home, Lock, User } from 'lucide-react';
import { Session, ClinicalNote, Patient } from '@/lib/types';

interface SessionDetailDialogProps {
    session: Session;
    patient?: Patient;
    note?: ClinicalNote;
    onClose: () => void;
}

export function SessionDetailDialog({ session, patient, note, onClose }: SessionDetailDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">פרטי מפגש</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">מטופל</p>
                            <p className="text-lg font-bold text-gray-900">{patient?.name || 'לא ידוע'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">תאריך</label>
                                <div className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-900">
                                    {new Date(session.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">שעה</label>
                                <div className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-900">
                                    {session.startTime}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">משך זמן</label>
                                <div className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-900">
                                    {session.duration} דק'
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">סטטוס</label>
                                <div className={`w-full px-4 py-3 border-none rounded-2xl font-bold text-center ${session.status === 'attended' ? 'bg-green-100 text-green-700' :
                                    session.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {session.status === 'attended' ? 'בוצע' : session.status === 'canceled' ? 'בוטל' : 'לא הגיע'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Content */}
                    <div className="pt-4 border-t border-gray-100 space-y-6">
                        <div>
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-blue-500" />
                                סיכום מפגש
                            </h3>
                            <div className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-medium text-gray-700 leading-relaxed min-h-[100px]">
                                {note?.therapyContent || 'אין תיעוד למפגש זה'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {note?.homework && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mr-1 flex items-center gap-1">
                                        <Home size={12} />
                                        משימות לבית
                                    </label>
                                    <div className="w-full px-4 py-3 bg-blue-50/50 border-none rounded-2xl font-medium text-blue-900">
                                        {note.homework}
                                    </div>
                                </div>
                            )}
                            {note?.internalPrivateNotes && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest mr-1 flex items-center gap-1">
                                        <Lock size={12} />
                                        הערות פנימיות
                                    </label>
                                    <div className="w-full px-4 py-3 bg-amber-50/50 border-none rounded-2xl font-medium text-amber-900 italic">
                                        {note.internalPrivateNotes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
                        >
                            סגירה
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
