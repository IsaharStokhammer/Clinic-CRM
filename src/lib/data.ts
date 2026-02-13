import { getGoogleSheetsClient, getSpreadsheetId } from './googleSheets';
import { Patient, Session, ClinicalNote, BillingEntry } from './types';

export async function getPatients(): Promise<Patient[]> {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Patients!A2:G', // Skip headers
        });

        const rows = response.data.values || [];

        return rows.map(row => ({
            id: row[0],
            name: row[1],
            parentName: row[2],
            phone: row[3],
            billingType: row[4] as 'per-session' | 'monthly',
            rate: Number(row[5]),
            status: row[6] as 'active' | 'inactive',
        }));
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
}

export async function getSessions(): Promise<Session[]> {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sessions!A2:F',
        });

        const rows = response.data.values || [];

        return rows
            .filter(row => row.length > 0 && row[0]) // Filter out empty rows or rows without ID
            .map(row => ({
                sessionId: row[0],
                patientId: row[1],
                date: row[2],
                startTime: row[3],
                duration: row[4],
                status: row[5] as 'attended' | 'canceled' | 'missed',
            }));
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return [];
    }
}

export async function getClinicalNotes(): Promise<ClinicalNote[]> {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'ClinicalNotes!A2:D',
        });

        const rows = response.data.values || [];

        return rows
            .filter(row => row.length > 0 && row[0])
            .map(row => ({
                sessionId: row[0],
                therapyContent: row[1],
                homework: row[2],
                internalPrivateNotes: row[3],
            }));
    } catch (error) {
        console.error('Error fetching clinical notes:', error);
        return [];
    }
}

export async function getBillingEntries(): Promise<BillingEntry[]> {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Billing!A2:F',
        });

        const rows = response.data.values || [];

        return rows
            .filter(row => row.length > 0 && row[0])
            .map(row => ({
                paymentId: row[0],
                patientId: row[1],
                date: row[2],
                amount: Number(row[3]),
                method: row[4],
                monthRef: row[5],
            }));
    } catch (error) {
        console.error('Error fetching billing entries:', error);
        return [];
    }
}

export async function getPatientFullData(id: string) {
    const [patients, sessions, notes, billing] = await Promise.all([
        getPatients(),
        getSessions(),
        getClinicalNotes(),
        getBillingEntries(),
    ]);

    const patient = patients.find(p => p.id === id);
    if (!patient) return null;

    const patientSessions = sessions
        .filter(s => s.patientId === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const patientBilling = billing
        .filter(b => b.patientId === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Join sessions with notes
    const sessionsWithNotes = patientSessions.map(session => ({
        ...session,
        note: notes.find(n => n.sessionId === session.sessionId),
    }));

    return {
        patient,
        sessions: sessionsWithNotes,
        billing: patientBilling,
    };
}
