import { google } from "googleapis";

// Initialize Google Sheets API
export async function getGoogleSheetsInstance() {
  // Prepare the private key - handle potential escape characters
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (
    !privateKey ||
    !process.env.GOOGLE_CLIENT_EMAIL ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    throw new Error("Missing required Google Sheets environment variables");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

// Add a new row to the Google Sheet
export async function addToWaitlist(email: string) {
  try {
    const sheets = await getGoogleSheetsInstance();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Get current date and time
    const timestamp = new Date().toISOString();

    // The data to append - adjust columns as needed
    const values = [[timestamp, email]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:B", // Adjust range as needed
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding to Google Sheet:", error);
    throw new Error("Failed to add email to waitlist");
  }
}
