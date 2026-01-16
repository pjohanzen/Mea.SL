/**
 * ========================================
 * MEA STATE LEADERS - GOOGLE APPS SCRIPT
 * ========================================
 * UPDATED: January 16, 2026
 * Spreadsheet ID: 1h5lTyYvmkbnUbKj77yyQb6RgRYzxBHpXTGvaSRMEw2s
 * Sheet Name: State Leaders
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    Logger.log('========== STATE LEADERS REQUEST ==========');
    
    // --- STEP 1: Parse incoming data ---
    let inputData = {};
    if (e.postData && e.postData.contents) {
      try {
        inputData = JSON.parse(e.postData.contents);
      } catch (err) {
        Logger.log('No JSON body');
      }
    }
    // Also check parameters (form-data/url-encoded)
    if (e.parameter) {
      for (const key in e.parameter) {
        if (e.parameter[key]) inputData[key] = e.parameter[key];
      }
    }
    
    const data = {
      name: inputData.name || '',
      email: inputData.email || '',
      phone: inputData.phone || '',
      bust: inputData.bust || '',
      naturalWaist: inputData.naturalWaist || '',
      pantWaist: inputData.pantWaist || '',
      hip: inputData.hip || '',
      thigh: inputData.thigh || '',
      jacketLength: inputData.jacketLength || '',
      jacketWidth: inputData.jacketWidth || '',
      pantsLength: inputData.pantsLength || '',
      pantsWidth: inputData.pantsWidth || '',
      size: inputData.size || ''
    };

    Logger.log('Parsed data: ' + JSON.stringify(data));

    // --- STEP 2: OPEN SPREADSHEET ---
    const SPREADSHEET_ID = '1h5lTyYvmkbnUbKj77yyQb6RgRYzxBHpXTGvaSRMEw2s';
    const TARGET_SHEET_NAME = 'State Leaders'; 
    
    Logger.log('Opening spreadsheet ID: ' + SPREADSHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    Logger.log('Looking for sheet tab: "' + TARGET_SHEET_NAME + '"');
    let sheet = spreadsheet.getSheetByName(TARGET_SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet tab "${TARGET_SHEET_NAME}" not found.`);
    }
    
    // --- STEP 3: APPEND DATA ---
    const rowData = [
      data.name,              // A
      data.email,             // B
      data.phone,             // C
      data.bust,              // D
      data.naturalWaist,      // E
      data.pantWaist,         // F
      data.hip,               // G
      data.thigh,             // H
      data.jacketLength,      // I
      data.jacketWidth,       // J
      data.pantsLength,       // K
      data.pantsWidth,        // L
      data.size,              // M
      new Date()              // N
    ];
    
    Logger.log('Appending row: ' + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    
    // --- STEP 4: SEND EMAIL ---
    if (data.email && data.name && data.size) {
      try {
        sendStateLeaderEmail(data);
      } catch (emailErr) {
        Logger.log('Email error: ' + emailErr.toString());
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    Logger.log('ERROR: ' + e.toString());
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Mea State Leaders API Active');
}

// --- EMAIL FUNCTION ---
function sendStateLeaderEmail(data) {
  if (!data.email) return;
  const firstName = (data.name || 'Friend').split(' ')[0];
  const subject = 'Your Mea Suit Recommendations';
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;600&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffe8e2; font-family: 'Inter', Helvetica, Arial, sans-serif; color: #111111;">
      <div style="padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          
          <h1 style="font-family: 'DM Serif Display', Georgia, serif; font-size: 28px; text-align: center; color: #111111; margin-top: 0; line-height: 1.2;">Your Recommended Size</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-top: 20px;">Hi ${firstName},</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333333;">Based on your measurements, here is your recommended size:</p>
          
          <div style="background: #fafafa; border: 1px solid #e5e5e5; border-left: 5px solid #ffb6a3; padding: 25px; margin: 30px 0; border-radius: 8px; text-align: center;">
            <span style="font-family: 'DM Serif Display', Georgia, serif; font-size: 24px; color: #111111; display: block;">${data.size}</span>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 30px;">
            One more step: secure your spot in our first factory run for just <strong style="color: #ff3131;">$150</strong> (regularly $225).
          </p>
          
          <div style="text-align: center; margin-bottom: 40px;">
            <a href="https://measuit.com/leadercheckout.html" style="display: inline-block; background-color: #ffb6a3; color: #111111; text-decoration: none; padding: 18px 40px; border-radius: 9999px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Secure Your Spot</a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="font-size: 14px; color: #777; text-align: center; line-height: 1.5;">
            Best,<br>
            <strong style="color: #111;">Brandon from Mea</strong>
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #777;">
          &copy; ${new Date().getFullYear()} Mea. All rights reserved.
        </div>
      </div>
    </body>
    </html>`;
    
  GmailApp.sendEmail(data.email, subject, '', {
    htmlBody: htmlBody,
    name: 'Brandon from Mea'
  });
}

// --- SETUP FUNCTION (Run once manually if needed) ---
function setup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Full Name", "Email Address", "Phone Number", "Bust", 
    "Natural Waist", "Pant Waist (Mid Rise)", "Hip", "Thigh", 
    "Jacket Length", "Jacket Width", "Pants Length", "Pants Width", 
    "Recommended Size", "Date/Time"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}