const csvtojson = require('csvtojson');

const { getAllHistoryTransWithQuery } = require('../db/history');

const processProTransfers = async (file, pathLocation) => {
    file.mv(pathLocation, async err => {
        if (err) {
            console.error(err);
            return { status: 500, err }
        }
    })

    const headers = ['portfolio', 'type', 'date', 'amount', 'balance', 'unit', 'transferId', 'tradeId', 'orderId']

    const jsonObj = await csvtojson({ noheader: false, headers }).fromFile(pathLocation)
    // console.log('processProTransfers jsonObj - ', jsonObj[1])

    const rows = jsonObj.filter(item => isNaN(parseFloat(item.amount)) === false)
    // console.log('processProTransfers rows - ', rows[1])

    if (!rows) {
        return { status: 404, err: 'no rows' };
    }

    // extract the transfers only ( deposits and withdrawal ) except 'USD' transactions
    const transfers = rows.filter(item => (item.type.toLowerCase() === 'deposit' || item.type.toLowerCase() === 'withdrawal') && (item.unit !== 'USD'))
    // console.log('processProTransfers transfers - ', transfers.length)

    const promise = transfers.map(async tran => {
        const resp = await getAllHistoryTransWithQuery({ coin: tran.unit.toUpperCase(), date: tran.date.substring(0, 10) })
        // console.log('resp - ', resp.data[0].dayPrice)
        let rate = 0;
        if (resp.success && resp.data[0]) {
            rate = resp.data[0].dayPrice;
        }

        const date = tran.date;
        const coin = tran.unit.toUpperCase();
        const quantity = isNaN(parseFloat(tran.amount)) ? 0 : Math.abs(parseFloat(tran.amount));
        const amount = quantity * rate;
        const fee = 0;
        const totalAmount = amount + fee;
        const notes = tran.transferId;
        const createdAt = new Date();
        const lastUpdatedAt = new Date();

        if (tran.type === 'deposit') {
            return [
                {
                    exchange: 'Coinbase', type: 'send',
                    date, coin, quantity, rate, amount, totalAmount, fee, notes, createdAt, lastUpdatedAt
                },
                {
                    exchange: 'CoinbasePro', type: 'receive',
                    date, coin, quantity, rate, amount, totalAmount, fee, notes, createdAt, lastUpdatedAt
                }
            ]
        } else {
            return [
                {
                    exchange: 'CoinbasePro', type: 'send',
                    date, coin, quantity, rate, amount, totalAmount, fee, notes, createdAt, lastUpdatedAt
                },
                {
                    exchange: 'Coinbase', type: 'receive',
                    date, coin, quantity, rate, amount, totalAmount, fee, notes, createdAt, lastUpdatedAt
                }
            ]
        }
    })

    const sendReceive = await Promise.all(promise);
    // console.log('processProTransfers sendReceive - ', sendReceive[0])

    // convert the multidimensional array into single dimensional array
    const document = sendReceive.reduce((accum, item) => accum.concat(item), [])
    // console.log('processProTransfers document - ', document[0])

    return { status: 200, document }
}

module.exports = processProTransfers;
