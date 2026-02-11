import { Phone, Edit, Trash2, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Patient } from '@/lib/types';
import { deletePatient, restorePatient } from '@/lib/actions';
import { TableRow, TableCell } from '@/components/ui/Table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface PatientRowProps {
    patient: Patient;
    activeTab: 'active' | 'inactive';
}

export function PatientRow({ patient, activeTab }: PatientRowProps) {
    return (
        <TableRow>
            <TableCell>
                <Link href={`/patients/${patient.id}`} className="flex items-center gap-4 group/item">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover/item:scale-110",
                        activeTab === 'active' ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gray-400"
                    )}>
                        {patient.name[0]}
                    </div>
                    <div>
                        <p className={cn(
                            "font-bold text-lg leading-tight transition-colors",
                            activeTab === 'active' ? "text-gray-900 group-hover/item:text-blue-600" : "text-gray-500"
                        )}>{patient.name}</p>
                        <p className="text-sm text-gray-400 font-medium">{patient.parentName}</p>
                    </div>
                </Link>
            </TableCell>
            <TableCell className="text-gray-600 font-semibold ltr text-left">
                <div className="flex items-center gap-2">
                    <Phone size={16} />
                    {patient.phone}
                </div>
            </TableCell>
            <TableCell>
                <span className={cn("text-lg font-black", activeTab === 'active' ? "text-gray-900" : "text-gray-500")}>
                    {patient.rate}
                    <span className="text-gray-400 text-xs font-normal mr-1">₪</span>
                </span>
                <div className="text-xs text-gray-400 font-medium">
                    {patient.billingType === 'monthly' ? 'לחודש' : 'למפגש'}
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Link href={`/patients/${patient.id}`} title="תיעוד ומעקב">
                        <Button variant="ghost" size="sm" className="px-2"> <Edit size={18} /> </Button>
                    </Link>

                    {activeTab === 'active' ? (
                        <form action={async () => {
                            if (confirm('האם אתה בטוח שברצונך להעביר לארכיון?')) {
                                await deletePatient(patient.id);
                            }
                        }}>
                            <Button variant="ghost" size="sm" className="px-2 text-gray-400 hover:text-red-600 hover:bg-red-50" title="העברה לארכיון">
                                <Trash2 size={18} />
                            </Button>
                        </form>
                    ) : (
                        <form action={async () => {
                            if (confirm('האם להחזיר מטופל זה לרשימה הפעילה?')) {
                                await restorePatient(patient.id);
                            }
                        }}>
                            <Button variant="ghost" size="sm" className="px-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" title="שחזור לרשימה פעילה">
                                <RefreshCcw size={18} />
                            </Button>
                        </form>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
