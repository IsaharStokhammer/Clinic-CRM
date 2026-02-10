import { getGoogleSheetsClient, SPREADSHEET_ID } from './googleSheets';

// הגדרת מבנה הגליונות והכותרות כפי שסיכמנו
const SHEETS_STRUCTURE = [
    {
        title: 'Patients',
        headers: ['ID', 'Name', 'ParentName', 'Phone', 'BillingType', 'Rate', 'Status']
    },
    {
        title: 'Sessions',
        headers: ['SessionID', 'PatientID', 'Date', 'StartTime', 'Duration', 'Status']
    },
    {
        title: 'ClinicalNotes',
        headers: ['SessionID', 'TherapyContent', 'Homework', 'InternalPrivateNotes']
    },
    {
        title: 'Billing',
        headers: ['PaymentID', 'PatientID', 'Date', 'Amount', 'Method', 'MonthRef']
    }
];

/**
 * הפונקציה המרכזית שמקימה את המבנה בתוך הגיליון
 */
export async function initializeDatabase() {
    const sheets = await getGoogleSheetsClient();

    if (!SPREADSHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID is missing in .env.local');
    }

    try {
        // 1. קבלת מידע על הגיליונות הקיימים בקובץ כרגע
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID
        });
        const existingSheets = metadata.data.sheets?.map(s => s.properties?.title) || [];

        // 2. ריצה על המבנה המבוקש
        for (const sheet of SHEETS_STRUCTURE) {
            if (!existingSheets.includes(sheet.title)) {
                console.log(`מקים את הגיליון: ${sheet.title}...`);

                // יצירת הטאב (Sheet) החדש
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId: SPREADSHEET_ID,
                    requestBody: {
                        requests: [{ addSheet: { properties: { title: sheet.title } } }]
                    }
                });

                // הזרקת שורת הכותרות (Headers) לשורה הראשונה
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${sheet.title}!A1`,
                    valueInputOption: 'RAW',
                    requestBody: { values: [sheet.headers] }
                });
            } else {
                console.log(`הגיליון ${sheet.title} כבר קיים, מדלג...`);
            }
        }

        return { success: true, message: 'הגיליון אותחל בהצלחה!' };
    } catch (error: any) {
        console.error('שגיאה בתהליך האיתחול:', error.response?.data || error.message);
        throw error;
    }
}