export interface Patient {
    id: string;
    name: string;
    parentName?: string;
    phone: string;
    billingType: 'per-session' | 'monthly';
    rate: number;
    status: 'active' | 'inactive';
}

export interface Session {
    sessionId: string;
    patientId: string;
    date: string;
    startTime: string;
    duration: string;
    status: 'attended' | 'canceled' | 'missed';
}

export interface ClinicalNote {
    sessionId: string;
    therapyContent: string;
    homework: string;
    internalPrivateNotes: string;
}

export interface BillingEntry {
    paymentId: string;
    patientId: string;
    date: string;
    amount: number;
    method: string;
    monthRef: string;
}
