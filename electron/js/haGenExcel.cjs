const {app} = require('electron');
const fs = require('fs');

const path = require('path');
const exJS = require('exceljs');

const downloads = app.getPath('downloads');
const ih_emps_dir = path.join(downloads, 'ih_emps');

const FIRST_DETAIL_ROW = 7;


function generateEmployeeInvoice(window, parms) {
  console.log('haGenExcel: downloads path', ih_emps_dir);
  // set up the file for this employee
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`; // e.g., "2025-01-13"
  // the slash is a problem for file names
  let accountName = parms.accountName.replace('/', '_');

  let xcelFileName = accountName + '_' + formattedDate + '.xlsx';
  let xcelFilePath = path.join(ih_emps_dir, xcelFileName);
  console.log('haGenExcel: downloads file', xcelFilePath);

  const workbook = new exJS.Workbook();
  workbook.creator = 'ih_ha_app';
  workbook.created = today;
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.views = [
    {
      x: 0, y: 0, width: 20000, height: 20000, depth: 0,
      firstSheet: 0, activeTab: 1, visibility: 'visible',
    },
  ];

  const worksheet = workbook.addWorksheet('Emp Invoice', {
    properties:
        {
          tabColor: {argb: '00a7ce0'},
        },
    pageSetup: {
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 25,
    },
    views: {
      state: 'frozen',
      activeCell: 'A1',
      ySplit: 1,
    },
  });

  const font = {name: 'Lucida Console', size: 12, bold: false};
  const fontB = {name: 'Lucida Console', size: 12, bold: true};

  const headerRows = [
    {column: 'B', value: 'Emp Name', font: font},
    {column: 'D', value: parms.accountName, font: fontB},
    {column: 'B', value: 'Status', font: font},
    {column: 'D', value: parms.accountStatus, font: fontB},
    {column: 'B', value: 'Date', font: font},
    {column: 'D', value: formattedDate, font: fontB},
    {column: 'B', value: 'Balance Due', font: font},
    {column: 'D', value: parms.charges.balance, font: fontB},
  ]

  let row = 1
  for (const headerRow of headerRows) {
    let column = headerRow.column + row;
    let cell = worksheet.getCell(column);
    cell.value = headerRow.value
    cell.font = headerRow.font;

    if (headerRow.column === 'D') {
      row += 1
    }
  }

  // set up the dollar format fot the balance due
  let balanceCell = worksheet.getCell('D4')
  balanceCell.numFmt = '$#,##0.00;[Red]-$#,##0.00'

  // worksheet.getRow(FIRST_DETAIL_ROW).font = fontB;
  // worksheet.getRow(5).values = [

  const firstDetail_row = worksheet.getRow(FIRST_DETAIL_ROW);
  firstDetail_row.font = fontB;
  firstDetail_row.values = [
    'Date',
    'Time',
    'Charge',
    'Payment',
    'Balance',
    'Description',
    'Notes'];

  worksheet.columns = [
    {key: 'tranDate', width: 15, style: {font: font}},
    {key: 'tranTime', width: 12, style: {font: font}},
    {
      key: 'credit',
      width: 15,
      style: {numFmt: '$#,##0.00;[Red]-$#,##0.00', font: font},
      alignment: {horizontal: 'right', vertical: 'top'},
    },
    {
      key: 'debit',
      width: 15,
      style: {numFmt: '$#,##0.00;[Red]-$#,##0.00', font: font},
      alignment: {horizontal: 'right', vertical: 'top'},
    },
    {
      key: 'balance',
      width: 15,
      style: {numFmt: '$#,##0.00;[Red]-$#,##0.00', font: font},
      alignment: {horizontal: 'right', vertical: 'top'},
    },
    {key: 'description', width: 32, style: {font: font}},
    {key: 'notes', width: 45, style: {font: font}},
  ];

  // console.log('haGenExcel: record 0: ', parms.records[0]);
  // only bring records since last 0 balance
  let currRecords = [];
  for (const record of parms.records) {
    let currRecord = record;
    // console.log('haGenExcel: record currRecord', currRecord);
    currRecord.tranDate = record.transactionDate;
    currRecord.tranTime = record.transactionDateTime.slice(-8);
    currRecord.debit = Number(record.debit);
    currRecord.credit = Number(record.credit);
    // need to clean up the balance after some weird math elsewhere
    currRecord.balance = Math.round(record.balance*100)/100;
    currRecords.push(currRecord);

    // currRecords.push(record);
    console.log(currRecord);

    if (currRecord.balance === 0) {
      break;
    }
  }
  worksheet.addRows(currRecords);
  balanceCell = worksheet.getCell('E6')
  balanceCell.font = fontB;

  // write the spreadsheet out
  workbook.xlsx.writeFile(xcelFilePath).then(() => {
    console.log('haGenExcel: generateEmployeeInvoice: File is written');
  });

}

module.exports = {
  generateEmployeeInvoice,
};