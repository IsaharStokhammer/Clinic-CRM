'use server';

import { getGoogleSheetsClient, SPREADSHEET_ID } from './googleSheets';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Patient, Session, ClinicalNote, BillingEntry } from './types';

// --- Patients ---

export async function addPatient(formData: FormData) {
    const name = formData.get('name') as string;
    const parentName = formData.get('parentName') as string;
    const phone = formData.get('phone') as string;
    const billingType = formData.get('billingType') as string;
    const rate = formData.get('rate') as string;

    if (!name || !phone || !billingType || !rate) {
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
    } catch (error) {
        console.error('Error adding patient:', error);
        throw new Error('Failed to add patient');
    }
}

export async function updatePatient(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const parentName = formData.get('parentName') as string;
    const phone = formData.get('phone') as string;
    const billingType = formData.get('billingType') as string;
    const rate = formData.get('rate') as string;
    const status = formData.get('status') as string;

    if (!id || !name || !phone || !billingType || !rate || !status) {
        throw new Error('All fields are required');
    }

    const sheets = await getGoogleSheetsClient();

    try {
        // 1. Find the row index
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Patients!A:A',
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[0] === id);

        if (rowIndex === -1) {
            throw new Error('Patient not found');
        }

        // 2. Update the row (A is col 0, G is col 6. Row is 1-indexed, so rowIndex + 1)
        const range = `Patients!A${rowIndex + 1}:G${rowIndex + 1}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[id, name, parentName, phone, billingType, rate, status]],
            },
        });

        revalidatePath('/patients');
        revalidatePath(`/patients/${id}`);
    } catch (error) {
        console.error('Error updating patient:', error);
        throw new Error('Failed to update patient');
    }
}

export async function deletePatient(id: string) {
    if (!id) throw new Error('Patient ID is required');

    const sheets = await getGoogleSheetsClient();

    try {
        // Soft delete: Find row and update status to 'inactive' (or 'deleted' if preferred, but user asked for soft delete 'inactive')
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Patients!A:G',
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[0] === id);

        if (rowIndex === -1) {
            throw new Error('Patient not found');
        }

        const currentState = rows[rowIndex];
        // id, name, parentName, phone, billingType, rate, status
        // We only want to change status (index 6) to 'inactive'

        // Construct the updated row efficiently or just update the specific cell G{row}
        // Updating just the status cell
        const range = `Patients!G${rowIndex + 1}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [['inactive']],
            },
        });

        revalidatePath('/patients');
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw new Error('Failed to delete patient');
    }

    // Redirect must be outside try-catch to work correctly with Next.js actions
    redirect('/patients');
}


// --- Sessions ---

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
    } catch (error) {
        console.error('Error adding session and clinical note:', error);
        throw new Error('Failed to save session');
    }
}

export async function deleteSession(sessionId: string) {
    // Delete session implementation. 
    // For MVP, we might just mark it as canceled or delete the row. 
    // Given the complexity of deleting rows in Sheets without messing up indices if done concurrently, 
    // a "canceled" status update is safer, but if "Delete" is requested, we can try to clear the row content or delete row.
    // Let's implement strict row deletion for Sessions as requested, taking care.

    // Actually, user asked for: "Implement the new actions: ... deleteSession."
    // Safe approach for Sheets: Filter it out in UI or use a status.
    // Let's try to actually delete the row from "Sessions" and "ClinicalNotes".

    const sheets = await getGoogleSheetsClient();

    try {
        // Find session row
        const sessionResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sessions!A:A',
        });

        const sessionRows = sessionResponse.data.values || [];
        const sessionRowIndex = sessionRows.findIndex(row => row[0] === sessionId);

        if (sessionRowIndex !== -1) {
            // We can't easily "delete row" with values.update. We need batchUpdate with deleteDimension which requires SHEET_ID (integer), not title.
            // Simplified approach: Clear the values in that row.

            const range = `Sessions!A${sessionRowIndex + 1}:F${sessionRowIndex + 1}`;
            await sheets.spreadsheets.values.clear({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
            });
        }

        // Also clear notes? (Optional but good for cleanup)
        const notesResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'ClinicalNotes!A:A',
        });
        const notesRows = notesResponse.data.values || [];
        const notesRowIndex = notesRows.findIndex(row => row[0] === sessionId);

        if (notesRowIndex !== -1) {
            const range = `ClinicalNotes!A${notesRowIndex + 1}:D${notesRowIndex + 1}`;
            await sheets.spreadsheets.values.clear({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
            });
        }

        revalidatePath('/sessions');
        // If we knew the patientId we could revalidate their page too, but we don't have it easily here without reading.
        revalidatePath('/');
    } catch (error) {
        console.error("Error deleting session:", error);
        throw new Error("Failed to delete session");
    }
}

// --- Billing ---

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

        revalidatePath(`/patients/${patientId}`);
    } catch (error) {
        console.error('Error adding billing entry:', error);
        throw new Error('Failed to add billing entry');
    }
}

export async function deleteBilling(paymentId: string) {
    if (!paymentId) throw new Error('Payment ID is required');

    const sheets = await getGoogleSheetsClient();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Billing!A:A',
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[0] === paymentId);

        if (rowIndex !== -1) {
            const range = `Billing!A${rowIndex + 1}:F${rowIndex + 1}`;
            await sheets.spreadsheets.values.clear({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
            });
        }

        revalidatePath('/');
    } catch (error) {
        console.error("Error deleting billing entry:", error);
        throw new Error("Failed to delete billing entry");
    }
}

export async function updateBilling(formData: FormData) {
    const paymentId = formData.get('paymentId') as string;
    const patientId = formData.get('patientId') as string;
    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const method = formData.get('method') as string;
    const monthRef = formData.get('monthRef') as string;

    if (!paymentId || !patientId || !date || !amount || !method || !monthRef) {
        throw new Error('All billing fields are required');
    }

    const sheets = await getGoogleSheetsClient();

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Billing!A:A',
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[0] === paymentId);

        if (rowIndex === -1) {
            throw new Error('Payment not found');
        }

        const range = `Billing!A${rowIndex + 1}:F${rowIndex + 1}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[paymentId, patientId, date, amount, method, monthRef]],
            },
        });

        revalidatePath(`/patients/${patientId}`);
        revalidatePath('/billing');
    } catch (error) {
        console.error('Error updating billing entry:', error);
        throw new Error('Failed to update billing entry');
    }
}
