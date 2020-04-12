const csvtojson = require('csvtojson');

const { getAllHistoryTransWithQuery } = require('../db/history');

const processBittrex = async (file, pathLocation) => {
    file.mv(pathLocation, async err => {
        if (err) {
            console.error(err);
            return { status: 500, err }
        }
    })

    const headers = ['uuid', 'conversion', 'date', 'type', 'limit', 'quantity', 'remaining', 'fee', 'amount', 'rate', 'filler1', 'filler2', 'filler3', 'filler4', 'filler5']

    const jsonObj = await csvtojson({ noheader: false, headers }).fromFile(pathLocation)
    // console.log('processBittrex jsonObj - ', jsonObj[0])

    const transactions = jsonObj.filter(item => isNaN(parseFloat(item.quantity)) === false)
    // console.log('processBittrex transactions - ', transactions[0])

    if (!transactions) {
        return { status: 404, err: 'no transactions' };
    }

    // split the converts into buy and sells
    const promise = transactions.map(async tran => {
        const exchange = 'Bittrex';
        const date = new Date(tran.date);
        const notes = `${tran.conversion} - ${tran.type} - ${tran.uuid}`;
        const currDate = new Date();

        let ccyymmdd = '';
        if (date) {
            // const d = new Date(tran.date);
            const ccyy = date.getFullYear();
            const mm = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
            const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
            ccyymmdd = `${ccyy}-${mm}-${dd}`;
        }
        // console.log('date - ', ccyymmdd);

        const fee = isNaN(parseFloat(tran.fee)) ? 0 : parseFloat(tran.fee)
        const amount = isNaN(parseFloat(tran.amount)) ? 0 : parseFloat(tran.amount)
        const quantity = isNaN(parseFloat(tran.quantity)) ? 0 : parseFloat(tran.quantity)

        const coins = tran.conversion.split('-');

        if (tran.type === 'LIMIT_BUY') {
            const coin1 = coins[0];
            const resp1 = await getAllHistoryTransWithQuery({ coin: coin1, date: ccyymmdd })
            let rate1 = 0;
            if (resp1.success && resp1.data[0]) {
                rate1 = resp1.data[0].dayPrice;
            }
            // console.log('rate1 - ', rate1)
            const type1 = 'convert-sell';
            const quantity1 = amount + fee;
            const amount1 = quantity1 * rate1;
            const fee1 = fee * rate1 / 2;
            const totalAmount1 = amount1 - fee1;

            const coin2 = coins[1];
            const type2 = 'convert-buy';
            const quantity2 = quantity;
            const totalAmount2 = totalAmount1;
            const fee2 = fee1;
            const amount2 = totalAmount2 - fee2;
            const rate2 = amount2 / quantity2;

            return [
                {
                    exchange,
                    date,
                    type: type1,
                    coin: coin1,
                    quantity: quantity1,
                    rate: rate1,
                    amount: amount1,
                    totalAmount: totalAmount1,
                    fee: fee1,
                    notes,
                    createdAt: currDate,
                    lastUpdatedAt: currDate
                },
                {
                    exchange,
                    date,
                    type: type2,
                    coin: coin2,
                    quantity: quantity2,
                    rate: rate2,
                    amount: amount2,
                    totalAmount: totalAmount2,
                    fee: fee2,
                    notes,
                    createdAt: currDate,
                    lastUpdatedAt: currDate
                }
            ]
        } else {
            const coin2 = coins[0];
            const resp2 = await getAllHistoryTransWithQuery({ coin: coin2, date: ccyymmdd })
            let rate2 = 0;
            if (resp2.success && resp2.data[0]) {
                rate2 = resp2.data[0].dayPrice;
            }
            // console.log('rate2 - ', rate2)
            const type2 = 'convert-buy';
            const quantity2 = amount - fee;
            const amount2 = amount * rate2;
            const fee2 = fee * rate2 / 2;
            const totalAmount2 = amount2 - fee2;

            const coin1 = coins[1];
            const type1 = 'convert-sell';
            const quantity1 = quantity;
            const totalAmount1 = totalAmount2;
            const fee1 = fee2;
            const amount1 = totalAmount1 - fee1;
            const rate1 = amount1 / quantity1;

            return [
                {
                    exchange,
                    date,
                    type: type1,
                    coin: coin1,
                    quantity: quantity1,
                    rate: rate1,
                    amount: amount1,
                    totalAmount: totalAmount1,
                    fee: fee1,
                    notes,
                    createdAt: currDate,
                    lastUpdatedAt: currDate
                },
                {
                    exchange,
                    date,
                    type: type2,
                    coin: coin2,
                    quantity: quantity2,
                    rate: rate2,
                    amount: amount2,
                    totalAmount: totalAmount2,
                    fee: fee2,
                    notes,
                    createdAt: currDate,
                    lastUpdatedAt: currDate
                }
            ]
        }
    })
    const buySells = await Promise.all(promise);
    // console.log('processBittrex buySells - ', buySells[0])

    // convert multidimensional array to single dimensional array
    const formattedBuySells = buySells.reduce((accum, curr) => accum.concat(curr), [])
    // console.log('processBittrex formattedBuySells - ', formattedBuySells[2])
    // console.log('processBittrex formattedBuySells - ', formattedBuySells[3])

    return { status: 200, document: formattedBuySells }
}

module.exports = processBittrex;
