'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import { PatientFilters } from './PatientList/PatientFilters';
import { PatientTable } from './PatientList/PatientTable';

export function PatientList({ allPatients = [] }: { allPatients: Patient[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

    const patients = Array.isArray(allPatients) ? allPatients : [];

    const activeCount = patients.filter(p => p.status === 'active').length;
    const inactiveCount = patients.filter(p => p.status === 'inactive').length;

    const filteredPatients = patients
        .filter(patient => patient.status === activeTab)
        .filter(patient =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (patient.parentName && patient.parentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            patient.phone.includes(searchQuery)
        );

    return (
        <div className="space-y-6">
            <PatientFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeCount={activeCount}
                inactiveCount={inactiveCount}
            />
            <PatientTable
                patients={filteredPatients}
                activeTab={activeTab}
            />
        </div>
    );
}
