import { Users, Archive } from 'lucide-react';
import { Patient } from '@/lib/types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PatientRow } from './PatientRow';

interface PatientTableProps {
    patients: Patient[];
    activeTab: 'active' | 'inactive';
}

export function PatientTable({ patients, activeTab }: PatientTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {activeTab === 'active' ? 'רשימת מטופלים' : 'ארכיון מטופלים'}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>מטופל/ת</TableHead>
                            <TableHead>פרטי קשר</TableHead>
                            <TableHead>חיוב</TableHead>
                            <TableHead>פעולות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map((patient) => (
                            <PatientRow key={patient.id} patient={patient} activeTab={activeTab} />
                        ))}
                        {patients.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={4} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                            {activeTab === 'active' ? <Users size={32} /> : <Archive size={32} />}
                                        </div>
                                        <p className="text-gray-400 font-bold text-xl italic">
                                            {activeTab === 'active'
                                                ? 'לא נמצאו מטופלים פעילים'
                                                : 'הארכיון ריק'
                                            }
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
