'use client';

import { X, Clock, User, ChevronLeft } from 'lucide-react';
import { Session, Patient } from '@/lib/types';
import Link from 'next/link';

interface DayDetailDialogProps {
    date: string; // YYYY-MM-DD
    sessions: Session[];
    patients: Patient[];
    onClose: () => void;
}

export function DayDetailDialog({ date, sessions, patients, onClose }: DayDetailDialogProps) {
    const formattedDate = new Date(date).toLocaleDateString('he-IL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" dir="rtl">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">פגישות היום</h2>
                        <p className="text-sm font-bold text-gray-400 mt-1">{formattedDate}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto font-sans">
                    {sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 font-medium italic">אין פגישות מתוכננות ליום זה</p>
                        </div>
                    ) : (
                        sessions.map((session) => {
                            const patient = patients.find(p => p.id === session.patientId);
                            return (
                                <Link
                                    key={session.sessionId}
                                    href={`/patients/${session.patientId}?sessionId=${session.sessionId}`}
                                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-2xl transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${session.status === 'attended' ? 'bg-green-100 text-green-600' :
                                            session.status === 'canceled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {patient?.name || '---'}
                                            </p>
                                            <p className="text-sm font-medium text-gray-500">
                                                {session.startTime} ({session.duration} דק')
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronLeft className="text-gray-300 group-hover:text-blue-500 transition-all shrink-0" />
                                </Link>
                            );
                        })
                    )}
                </div>

                <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg"
                    >
                        סגירה
                    </button>
                </div>
            </div>
        </div>
    );
}
