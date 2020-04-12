const csvtojson = require('csvtojson');

const { getAllHistoryTransWithQuery } = require('../db/history');

const processBittrexTransfers = async (file, pathLocation) => {
    file.mv(pathLocation, async err => {
        if (err) {
            console.error(err);
            return { status: 500, err }
        }
    })

    const headers = ['type', 'status', 'txId', 'address', 'date', 'coin', 'quantity', 'confirmations', 'fee']

    const jsonObj = await csvtojson({ noheader: false, headers }).fromFile(pathLocation)
    // console.log('processBittrexTransfers jsonObj - ', jsonObj[0])

    const transactions = jsonObj.filter(item => isNaN(parseFloat(item.quantity)) === false)
    // console.log('processBittrexTransfers transactions - ', transactions[0])

    if (!transactions) {
        return { status: 404, err: 'no transactions' };
    }

    // split the converts into buy and sells
    const promise = transactions.map(async tran => {
        const exchange = 'Bittrex';
        const coin = tran.coin;
        const notes = `${tran.txId} - ${tran.address}`;
        const currDate = new Date();
        const date = new Date(tran.date);
        const quantity = isNaN(parseFloat(tran.quantity)) ? 0 : parseFloat(tran.quantity)
        const fee = isNaN(parseFloat(tran.fee)) ? 0 : parseFloat(tran.fee)

        let ccyymmdd = '';
        if (date) {
            // const d = new Date(tran.date);
            const ccyy = date.getFullYear();
            const mm = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
            const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
            ccyymmdd = `${ccyy}-${mm}-${dd}`;
        }
        // console.log('date - ', ccyymmdd);
        const resp = await getAllHistoryTransWithQuery({ coin, date: ccyymmdd })
        let rate = 0;
        if (resp.success && resp.data[0]) {
            rate = resp.data[0].dayPrice;
        }
        // console.log('rate - ', rate)

        if (tran.type === 'deposit') {
            const type = 'receive';
            const amount = quantity * rate;
            const fee = 0;
            const totalAmount = amount + fee;
            return {
                exchange, date, type, coin, quantity, rate, amount, fee, totalAmount, notes,
                createdAt: currDate,
                lastUpdatedAt: currDate
            }
        } else {
            const type = 'send';
            const quantity1 = quantity + fee;
            const amount = quantity * rate;
            const fee1 = fee * rate;
            const totalAmount = amount + fee1;
            return {
                exchange, date, type, coin, rate, amount, totalAmount, notes,
                quantity: quantity1,
                fee: fee1,
                createdAt: currDate,
                lastUpdatedAt: currDate
            }
        }
    })
    const buySells = await Promise.all(promise);
    // console.log('processBittrexTransfers buySells - ', buySells[0])

    return { status: 200, document: buySells }
}

module.exports = processBittrexTransfers;
