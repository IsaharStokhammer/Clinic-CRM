'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, FileText, Home, Lock, Trash2 } from 'lucide-react';
import { Session, ClinicalNote } from '@/lib/types';
import { deleteSession } from '@/lib/actions';

interface SessionTimelineItemProps {
    session: Session & { note?: ClinicalNote };
    index: number;
}

export function SessionTimelineItem({ session, index }: SessionTimelineItemProps) {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const [isOpen, setIsOpen] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sessionId === session.sessionId) {
            setIsOpen(true);
            setTimeout(() => {
                itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [sessionId, session.sessionId]);

    return (
        <div
            ref={itemRef}
            className="relative pr-16 group/timeline transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Timeline Connector */}
            <div className="absolute right-[1.125rem] top-0 bottom-0 w-px bg-gray-100 group-last/timeline:h-8" />

            {/* Timeline Dot */}
            <div className={`absolute right-3 top-8 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-colors duration-300 ${session.status === 'attended' ? 'bg-blue-600' :
                    session.status === 'canceled' ? 'bg-rose-500' : 'bg-amber-500'
                }`}></div>

            <div
                className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 transition-all duration-500 overflow-hidden ${isOpen ? 'shadow-xl shadow-gray-200/50 border-blue-100 ring-1 ring-blue-50' : 'hover:shadow-md hover:border-gray-200'
                    }`}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-right p-6 md:p-8 flex justify-between items-center group"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-2 py-0.5 rounded-md">
                                {new Date(session.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                            </span>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                {new Date(session.date).toLocaleDateString('he-IL', { weekday: 'long' })} • {session.startTime}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                מפגש טיפולי ({session.duration} דק')
                            </h3>
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${session.status === 'attended' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' :
                                    session.status === 'canceled' ? 'bg-rose-50 text-rose-700 ring-rose-100' : 'bg-amber-50 text-amber-700 ring-amber-100'
                                }`}>
                                {session.status === 'attended' ? 'בוצע' : session.status === 'canceled' ? 'בוטל' : 'לא הגיע'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <form action={async () => {
                            if (confirm('האם אתה בטוח שברצונך למחוק מפגש זה?')) {
                                await deleteSession(session.sessionId);
                            }
                        }} onClick={(e) => e.stopPropagation()}>
                            <button type="submit" className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="מחיקת מפגש">
                                <Trash2 size={18} />
                            </button>
                        </form>
                        <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}>
                            <ChevronDown size={24} />
                        </div>
                    </div>
                </button>

                <div
                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    {session.note ? (
                        <div className="px-6 pb-6 space-y-6">
                            <div className="pt-4 border-t border-gray-50">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <FileText size={14} />
                                            סיכום טיפול
                                        </p>
                                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                                            {session.note.therapyContent || 'אין תיעוד למפגש זה'}
                                        </div>
                                    </div>

                                    {session.note.homework && (
                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                                            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Home size={14} />
                                                תרגול/שיעורי בית
                                            </p>
                                            <p className="text-blue-800">{session.note.homework}</p>
                                        </div>
                                    )}

                                    {session.note.internalPrivateNotes && (
                                        <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100/50 border-dashed">
                                            <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Lock size={14} />
                                                הערות פנימיות
                                            </p>
                                            <p className="text-amber-800 italic text-sm">{session.note.internalPrivateNotes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 pb-6 pt-4 border-t border-gray-50 text-center text-gray-400 text-sm italic">
                            אין תיעוד נוסף עבור מפגש זה
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
