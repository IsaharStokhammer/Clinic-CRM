'use client';

import { useState } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { Patient } from '@/lib/types';

interface PatientSearchSelectProps {
    patients: Patient[];
    defaultValue?: string;
    required?: boolean;
    name: string;
}

export function PatientSearchSelect({ patients, defaultValue = '', required = true, name }: PatientSearchSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(defaultValue);

    const selectedPatient = patients.find(p => p.id === selectedId);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.parentName && p.parentName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="relative">
            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={selectedId} required={required} />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl flex items-center justify-between text-right focus:ring-2 focus:ring-indigo-500 transition-all"
            >
                <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400" />
                    <span className={`font-medium ${selectedPatient ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selectedPatient ? selectedPatient.name : 'בחר מטופל...'}
                    </span>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-50">
                        <div className="relative">
                            <input
                                autoFocus
                                type="text"
                                placeholder="חיפוש לפי שם..."
                                className="w-full px-10 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map(patient => (
                                <button
                                    key={patient.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedId(patient.id);
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className={`w-full text-right px-4 py-3 hover:bg-indigo-50 transition-colors flex flex-col ${selectedId === patient.id ? 'bg-indigo-50/50' : ''}`}
                                >
                                    <span className="font-bold text-gray-900">{patient.name}</span>
                                    {patient.parentName && (
                                        <span className="text-xs text-gray-400 font-medium">הורה: {patient.parentName}</span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-400 text-sm italic">
                                לא נמצאו מטופלים העונים לחיפוש
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop to close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
