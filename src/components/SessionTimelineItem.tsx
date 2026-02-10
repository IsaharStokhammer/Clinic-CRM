'use client';

import { useState } from 'react';
import { ChevronDown, FileText, Home, Lock, Trash2 } from 'lucide-react';
import { Session, ClinicalNote } from '@/lib/types';
import { deleteSession } from '@/lib/actions';

interface SessionTimelineItemProps {
    session: Session & { note?: ClinicalNote };
    index: number;
}

export function SessionTimelineItem({ session, index }: SessionTimelineItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative pr-16 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="absolute right-4 top-6 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10"></div>

            <div
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 overflow-hidden ${isOpen ? 'ring-2 ring-blue-100 border-blue-200' : 'hover:border-gray-200 shadow-gray-200/50'
                    }`}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-right p-6 flex justify-between items-center group"
                >
                    <div className="flex-1">
                        <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">
                            {new Date(session.date).toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                מפגש טיפולי - {session.startTime} ({session.duration} דק')
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${session.status === 'attended' ? 'bg-green-100 text-green-700' :
                                session.status === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
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
