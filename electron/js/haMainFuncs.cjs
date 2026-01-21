const { default: axios } = require("axios");
const { app } = require("electron");
const path = require("path");

// const isDev = !app.isPackaged;
const appData = app.getPath("userData");
let configFile = path.join(appData, "ih-ap-config.json");
const cbConfig = require(configFile);

const cbPropertyID = cbConfig.cbPropertyID;
const cbServer = cbConfig.cbServer;
const cbOptions = cbConfig.cbOptions;
const cbPostOptions = cbConfig.cbPostOptions;
const cbApiHA_Details = "getHouseAccountDetails?";
const cbApiHA_List = "getHouseAccountList?";
const cbApiPostItem = "postItem?";

const computeCharges = (accountName, accountType, haData) => {
    const flTax = 0.075
    const ccFee = 0.03
    let credit = haData.total.credit.slice(4).replaceAll(',', '')
    let debit = haData.total.debit.slice(4).replaceAll(',', '')
    let balance = credit - debit
    let monMin = ''
    let minDelta = ''
    let minTax = ''
    let subTot = ''
    let creChg = ''
    let totChg = ''

    // console.log('computeCharges: ', accountType);
    if (balance >= 0) {
        if (accountType === 'a') {
            if (accountName.includes("&")) {
                monMin = 200;
            } else {
                monMin = 100;
            }
            minDelta = balance < monMin ? monMin - balance : 0
            minTax = minDelta * flTax
            subTot = balance + minDelta + minTax
        } else {
            subTot = balance
        }
    creChg = subTot * ccFee
    totChg = subTot + creChg
    }

    return {
        balance: balance,
        monMin: monMin,
        minDelta: minDelta,
        minTax: minTax,
        subTot: subTot,
        creChg: creChg,
        totChg: totChg
    }
}


let haWin;
const getHADetails = (window, parms) => {
    let { rowID, actName, accountStatus, actType } = parms;
    console.log('ipcMain haMainFuncs: getHADetails: ', rowID, actName, accountStatus, actType)
    let keyID = rowID;
    let date = new Date();
    let year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // console.log('ipcMain main: getHaBalance: ', keyID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        houseAccountID: keyID,
        resultsFrom: '2024-07-08',
        resultsTo: formattedDate,
    })
    let haRecord = {};
    haRecord.timeStamp = Date.now();
    haRecord.accountID = keyID;
    haRecord.accountName = actName;
    haRecord.accountStatus = accountStatus;
    haRecord.accountType = actType;

    fetch(cbServer + cbApiHA_Details + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            let haData = data.data;

            // let charges = computeCharges(haRecord.accountName, haRecord.accountType, haData)
            haRecord.charges = computeCharges(haRecord.accountName, haRecord.accountType, haData)
            haRecord.records = haData.records
            // console.log(`credit: ${credit} - debit: ${debit} = balance: ${balance}`) // console.log('credit: ', credit) 
            // return resData
            window.webContents.send("haDetails", haRecord);
        })
        .catch(err => {
            // console.log(`main: getHaBalance: ${record} error: ${err}`) // console.log(err)
            window.webContents.send("haDetails", haRecord);
            console.error(err)
        })
}
const getHA = (window) => {
    haWin = window;
    console.log('haMainFuncs: getHA');

    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        accountStatus: "open",
        limit: 10,
    });

    fetch(cbServer + cbApiHA_List + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            let haAcctRecordsList = [];
            let haData = data.data;
            for (let i = 0; i < haData.length; i++) {
                let dtRecord = haData[i];
                // want only house accounts
                let acct_type = '';
                if (dtRecord.accountName.includes("GC")) {
                    acct_type = 'g'
                } else if (dtRecord.accountName.includes("IH")) {
                    acct_type = 'e'
                } else {
                    acct_type = 'a'
                }
                let isGC = dtRecord.accountName.startsWith("GC")
                let isEmp = dtRecord.accountName.startsWith("IH")
                if (isGC || isEmp) {
                    // continue
                }
                let haRecord = {};
                haRecord.timeStamp = Date.now();
                haRecord.accountID = haData[i].accountID;
                haRecord.accountName = haData[i].accountName;
                haRecord.accountStatus = haData[i].accountStatus;
                haRecord.accountType = acct_type;
                haRecord.charges = {};
                haRecord.charges.balance = 0;
                haRecord.charges.monMin = 0;
                haRecord.charges.minDelta = 0;
                haRecord.charges.minTax = 0;
                haRecord.charges.subTot = 0;
                haRecord.charges.creChg = 0;
                haRecord.charges.totChg = 0;

                haAcctRecordsList.push(haRecord);
            }
            // log("main: getHA_List:");
            haAcctRecordsList.sort((a, b) => (a.accountName > b.accountName ? 1 : -1));
            // console.log("main: getHA_List: ", haAcctRecordsList.length);
            // console.log("main: getHA_List: ", haAcctRecordsList[0]);
            haWin.webContents.send("haList", haAcctRecordsList); // send to preload
        })
        .catch(err => console.error(err))
        ;


}


const postAcctCharge = (window, parms) => {
    haWin = window;
    let { accountID, accountName, accountStatus, adjustAmt, ccService } = parms;
    let postOptions = cbPostOptions;
    let data = {
        propertyID: cbPropertyID,
        houseAccountID: accountID,
        itemID: cbConfig.cbItmMinAdjID,
        itemQuantity: 1,
        itemPrice: adjustAmt.toFixed(2),
        itemNote: "App Generated"
    }

    axios.post(cbServer + cbApiPostItem, data, postOptions)
        .then(res => {
            console.log('ipcMain haMainFuncs: postAcctCharge: ', res.data)
            postCCService(window, { accountID, accountName, accountStatus, ccService })
        })
        .catch(err => console.error(err))
        ;

};

const postCCService = (window, parms) => {
    haWin = window;
    let { accountID, accountName, accountStatus, ccService } = parms;
    console.log('ipcMain haMainFuncs: postCCService: ', accountID, accountName, accountStatus, ccService)
    let itemCount = 1;
    let postOptions = cbPostOptions;
    let data = {
        propertyID: cbPropertyID,
        houseAccountID: accountID,
        itemID: cbConfig.cbItmCCFeeID,
        itemQuantity: itemCount,
        itemPrice: ccService.toFixed(2),
        itemNote: "App Generated"
    }

    axios.post(cbServer + cbApiPostItem, data, postOptions)
        .then(res => {
            console.log('ipcMain haMainFuncs: postCCService: ', res.data)
            getHADetails(window, { rowID: accountID, actName: accountName, accountStatus: accountStatus })
        })
        .catch(err => console.error(err))
        ;


}

// const generateEmployeeInvoice = (window, parms) => {
//     console.log('ipcMain haMainFuncs: generateEmployeeInvoice: ', parms)
// }
module.exports = {
    getHA, getHADetails,
    postAcctCharge,
    postCCService,
    // generateEmployeeInvoice,
};