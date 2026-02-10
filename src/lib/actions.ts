'use server';

import { getGoogleSheetsClient, SPREADSHEET_ID } from './googleSheets';
import { revalidatePath } from 'next/cache';

export async function addPatient(formData: FormData) {
    const name = formData.get('name') as string;
    const parentName = formData.get('parentName') as string;
    const phone = formData.get('phone') as string;
    const billingType = formData.get('billingType') as string;
    const rate = formData.get('rate') as string;

    if (!name || !parentName || !phone || !billingType || !rate) {
        throw new Error('All fields are required');
    }

    const sheets = await getGoogleSheetsClient();
    const id = crypto.randomUUID();
    const status = 'active';

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Patients!A:G',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[id, name, parentName, phone, billingType, rate, status]],
            },
        });

        revalidatePath('/patients');
        return { success: true };
    } catch (error) {
        console.error('Error adding patient:', error);
        throw new Error('Failed to add patient');
    }
}

export async function addSession(formData: FormData) {
    const patientId = formData.get('patientId') as string;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const duration = formData.get('duration') as string;
    const status = formData.get('status') as string; // attended/canceled/missed

    // Clinical Note fields
    const therapyContent = formData.get('therapyContent') as string || '';
    const homework = formData.get('homework') as string || '';
    const internalPrivateNotes = formData.get('internalPrivateNotes') as string || '';

    if (!patientId || !date || !startTime || !duration || !status) {
        throw new Error('Required session fields are missing');
    }

    const sheets = await getGoogleSheetsClient();
    const sessionId = crypto.randomUUID();

    try {
        // 1. Add Session
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sessions!A:F',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[sessionId, patientId, date, startTime, duration, status]],
            },
        });

        // 2. Add Clinical Note linked by sessionId
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'ClinicalNotes!A:D',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[sessionId, therapyContent, homework, internalPrivateNotes]],
            },
        });

        revalidatePath(`/patients/${patientId}`);
        revalidatePath('/sessions');
        return { success: true };
    } catch (error) {
        console.error('Error adding session and clinical note:', error);
        throw new Error('Failed to save session');
    }
}

export async function addBilling(formData: FormData) {
    const patientId = formData.get('patientId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const method = formData.get('method') as string;
    const monthRef = formData.get('monthRef') as string;

    if (!patientId || !date || !amount || !method || !monthRef) {
        throw new Error('All billing fields are required');
    }

    const sheets = await getGoogleSheetsClient();
    const paymentId = crypto.randomUUID();

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Billing!A:F',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[paymentId, patientId, date, amount, method, monthRef]],
            },
        });

        revalidatePath('/billing');
        revalidatePath(`/patients/${patientId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding billing entry:', error);
        throw new Error('Failed to add billing entry');
    }
}
