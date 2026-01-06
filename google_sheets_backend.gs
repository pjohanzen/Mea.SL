function doPost(e) {
  // Open the spreadsheet by ID to ensure we target the correct file
  var sheet = SpreadsheetApp.openById("1bhKmQ3WExU6ehH8-S-Y_SlXbku8cY-90-kNiWEVSqYo").getSheetByName("Sheet1"); // Gets the sheet named "Sheet1"
  
  // Get data from the POST request
  var p = e.parameter;
  
  // Prepare the row data based on the headers provided:
  // Full Name, Email Address, Phone Number, Bust, Natural Waist, Pant Waist (Mid Rise), Hip, Thigh, Jacket Length, Jacket Width, Pants Length, Pants Width
  
  var rowData = [
    p.name,              // Full Name
    p.email,             // Email Address
    p.phone,             // Phone Number
    p.bust,              // Bust
    p.naturalWaist,      // Natural Waist
    p.pantWaist,         // Pant Waist (Mid Rise)
    p.hip,               // Hip
    p.thigh,             // Thigh
    p.jacketLength,      // Jacket Length
    p.jacketWidth,       // Jacket Width
    p.pantsLength,       // Pants Length
    p.pantsWidth,        // Pants Width
    new Date()           // Timestamp (optional, but good to have)
  ];
  
  // Append the row to the sheet
  sheet.appendRow(rowData);
  
  // Return a JSON success response
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "Full Name", 
    "Email Address", 
    "Phone Number", 
    "Bust", 
    "Natural Waist", 
    "Pant Waist (Mid Rise)", 
    "Hip", 
    "Thigh", 
    "Jacket Length", 
    "Jacket Width", 
    "Pants Length", 
    "Pants Width",
    "Timestamp"
  ];
  
  // Set headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}
