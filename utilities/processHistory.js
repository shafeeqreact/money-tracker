const csvtojson = require('csvtojson');

const processHistory = async (file, pathLocation) => {
    file.mv(pathLocation, async err => {
        if (err) {
            console.log('processHistory file.mv error. err - ', err);
            return { status: 500, err }
        }
    })
    // console.log('processHistory.js - file , path - ', file, pathLocation)

    try {
        const headers = ['date', 'open', 'high', 'low', 'close', 'volume', 'marketCap']
        const jsonObj = await csvtojson({ noheader: false, headers }).fromFile(pathLocation)
        console.log('/utilities/processHistory.js jsonObj - ', jsonObj[0])
        if (!jsonObj[0]) {
            return { status: 404, err: 'csvtojson conversion failed' };
        }

        // exclude header record
        const transactions = jsonObj.filter(item => isNaN(parseFloat(item.open)) === false)

        if (!transactions[0]) {
            return { status: 404, err: 'no transactions' };
        }
        // console.log('processHistory transactions - ', transactions[1])

        // extract coin code from the file name. 
        // example - extract BTC from BTC_History.csv file name.
        const coin = file.name.split('_')[0]

        const formattedTrans = transactions.map(tran => {
            let date = '';
            if (tran.date) {
                const d = new Date(tran.date);
                const ccyy = d.getFullYear();
                const mm = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
                const dd = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
                date = `${ccyy}-${mm}-${dd}`;
            }

            const open = isNaN(parseFloat(tran.open)) ? 0 : parseFloat(tran.open);
            const high = isNaN(parseFloat(tran.high)) ? 0 : parseFloat(tran.high);
            const low = isNaN(parseFloat(tran.low)) ? 0 : parseFloat(tran.low);
            const close = isNaN(parseFloat(tran.close)) ? 0 : parseFloat(tran.close);
            const dayPrice = (open + close) / 2;

            return { date, coin, open, high, low, close, dayPrice }
        })
        // console.log('processHistory formattedTrans - ', formattedTrans[2])

        return { status: 200, document: formattedTrans }
    } catch (err) {
        console.log('processHistory csvtojson failed. error - ', err)
        return { status: 400, err: 'csvtojson failed' };
    }
}

module.exports = processHistory;