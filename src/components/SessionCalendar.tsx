'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Session, Patient, ClinicalNote } from '@/lib/types';
import { DayDetailDialog } from './DayDetailDialog';

interface SessionCalendarProps {
    sessions: Session[];
    patients: Patient[];
    notes: ClinicalNote[];
}

export function SessionCalendar({ sessions, patients, notes }: SessionCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    }, [daysInMonth, firstDayOfMonth]);

    const sessionsByDay = useMemo(() => {
        const map: Record<string, Session[]> = {};
        sessions.forEach(s => {
            if (!s.date) return;
            const dateStr = s.date;
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(s);
        });
        return map;
    }, [sessions]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden" dir="rtl">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{monthName}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">תצוגה חודשית</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 hover:bg-gray-50 rounded-xl transition-colors text-gray-600"
                        title="חודש הבא"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors text-xs font-bold text-gray-900"
                    >
                        היום
                    </button>
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 hover:bg-gray-50 rounded-xl transition-colors text-gray-600"
                        title="חודש קודם"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 border-b border-gray-50 bg-white">
                {['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'ש\''].map(day => (
                    <div key={day} className="py-2 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid - Optimized height for visual clarity without scroll */}
            <div className="grid grid-cols-7 auto-rows-[minmax(90px,1fr)]">
                {calendarDays.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="bg-gray-50/30 border-l border-b border-gray-50 last:border-l-0"></div>;
                    }

                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const daySessions = sessionsByDay[dateStr] || [];
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                    return (
                        <div
                            key={day}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`p-2 border-l border-b border-gray-50 last:border-l-0 relative group hover:bg-indigo-50/30 transition-all cursor-pointer ${isToday ? 'bg-indigo-50/30' : 'bg-white'
                                }`}
                        >
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black mb-1.5 ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 group-hover:text-indigo-600'
                                }`}>
                                {day}
                            </span>

                            <div className="space-y-0.5 max-h-[60px] overflow-hidden">
                                {daySessions.slice(0, 2).map(session => {
                                    const patient = patients.find(p => p.id === session.patientId);
                                    return (
                                        <div
                                            key={session.sessionId}
                                            className={`w-full text-right px-1.5 py-0.5 rounded-md text-[9px] font-bold truncate flex items-center gap-1 border ${session.status === 'attended'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : session.status === 'canceled'
                                                        ? 'bg-red-50 text-red-700 border-red-100'
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}
                                        >
                                            <span className="shrink-0 w-1 h-1 rounded-full bg-current"></span>
                                            <span className="truncate">{patient?.name || '---'}</span>
                                        </div>
                                    );
                                })}
                                {daySessions.length > 2 && (
                                    <div className="text-[8px] font-black text-indigo-400 text-center uppercase tracking-tighter pt-0.5">
                                        +{daySessions.length - 2} נוספים
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDate && (
                <DayDetailDialog
                    date={selectedDate}
                    sessions={sessionsByDay[selectedDate] || []}
                    patients={patients}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
}
