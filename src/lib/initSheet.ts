import { getGoogleSheetsClient, getSpreadsheetId } from './googleSheets';

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
    // 1. בדיקה בטוחה של המזהה - ללא זריקת שגיאה שתפיל את השרת
    const spreadsheetId = getSpreadsheetId();

    if (!spreadsheetId) {
        console.error('❌ Missing GOOGLE_SHEET_ID. Ensure it is set in Vercel Environment Variables.');
        return {
            success: false,
            message: 'המערכת לא מצאה את מזהה הגיליון. אנא בדוק את הגדרות השרת.'
        };
    }

    try {
        const sheets = await getGoogleSheetsClient();

        // 2. קבלת מידע על הגיליונות הקיימים
        const metadata = await sheets.spreadsheets.get({
            spreadsheetId
        });
        const existingSheets = metadata.data.sheets?.map(s => s.properties?.title) || [];

        // 3. ריצה על המבנה המבוקש
        for (const sheet of SHEETS_STRUCTURE) {
            if (!existingSheets.includes(sheet.title)) {
                console.log(`מקים את הגיליון: ${sheet.title}...`);

                // יצירת הטאב (Sheet) החדש
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [{ addSheet: { properties: { title: sheet.title } } }]
                    }
                });

                // הזרקת שורת הכותרות (Headers) לשורה הראשונה
                await sheets.spreadsheets.values.update({
                    spreadsheetId,
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
        // מחזירים אובייקט שגיאה במקום לזרוק אותה, כדי למנוע Application Error לבן
        return {
            success: false,
            message: 'אירעה שגיאה בחיבור לגוגל שיטס. וודא שהרשאות ה-Service Account תקינות.'
        };
    }
}