const csvtojson = require('csvtojson');

const { getAllHistoryTransWithQuery } = require('../db/history');

const processCoinbasePro = async (file, pathLocation) => {
    file.mv(pathLocation, async err => {
        if (err) {
            console.error(err);
            return { status: 500, err }
        }
    })

    const headers = ['portfolio', 'tradeId', 'product', 'side', 'createdAt', 'quantity', 'transCoin', 'price', 'fee', 'total', 'baseCoin']

    const jsonObj = await csvtojson({ noheader: false, headers }).fromFile(pathLocation)
    // console.log('processCoinbasePro jsonObj - ', jsonObj[0])

    const transactions = jsonObj.filter(item => isNaN(parseFloat(item.quantity)) === false)
    // console.log('processCoinbasePro transactions - ', transactions[0])

    if (!transactions) {
        return { status: 404, err: 'no transactions' };
    }

    // process the pure USD transactions
    const usdTrans = transactions.filter(item => item.baseCoin.toUpperCase() === 'USD')
    // console.log('processCoinbasePro usdTrans - ', usdTrans[0])

    const buySells = usdTrans.map(tran => {
        const exchange = 'CoinbasePro';
        const date = tran.createdAt;
        const type = tran.side.toLowerCase();
        const coin = tran.transCoin.toUpperCase();
        const quantity = isNaN(parseFloat(tran.quantity)) ? 0 : parseFloat(tran.quantity);
        const rate = isNaN(parseFloat(tran.price)) ? 0 : parseFloat(tran.price);
        const amount = quantity * rate;
        const fee = isNaN(parseFloat(tran.fee)) ? 0 : parseFloat(tran.fee);
        const totalAmount = isNaN(parseFloat(tran.total)) ? 0 : Math.abs(parseFloat(tran.total));
        const notes = `${tran.tradeId} - ${tran.product}`;

        return {
            exchange, date, type, coin, quantity, rate, amount, totalAmount, fee, notes,
            createdAt: new Date(),
            lastUpdatedAt: new Date()
        }
    })

    console.log('processCoinbasePro buySells - ', buySells[0])

    // extract pure buy/sells 
    const converts = transactions.filter(item => item.baseCoin.toUpperCase() !== 'USD')
    // console.log('processCoinbasePro converts - ', converts[0])

    const promise = converts.map(async tran => {
        const exchange = 'CoinbasePro';
        const createdAt = tran.createdAt;
        const date = new Date(createdAt);
        const quantity = isNaN(parseFloat(tran.quantity)) ? 0 : parseFloat(tran.quantity);
        const transCoin = tran.transCoin.toUpperCase();
        const price = isNaN(parseFloat(tran.price)) ? 0 : parseFloat(tran.price);
        const fee = isNaN(parseFloat(tran.fee)) ? 0 : parseFloat(tran.fee);
        const totalAmount = isNaN(parseFloat(tran.total)) ? 0 : parseFloat(tran.total);
        const baseCoin = tran.baseCoin.toUpperCase();
        const notes = `${tran.tradeId} - ${tran.product}`;
        const currDate = new Date();

        const resp = await getAllHistoryTransWithQuery({ coin: baseCoin, date: createdAt.substring(0, 10) })
        let rate = 0;
        if (resp.success && resp.data[0]) {
            rate = resp.data[0].dayPrice;
        }
        // console.log('rate - ', rate)

        if (tran.side === 'BUY') {
            const type1 = 'convert-sell';
            const coin1 = baseCoin;
            const quantity1 = Math.abs(totalAmount);
            const rate1 = rate;
            const fee1 = fee * rate1 / 2;
            const amount1 = quantity1 * rate1;
            const totalAmount1 = amount1 - fee1;

            const type2 = 'convert-buy';
            const coin2 = transCoin;
            const quantity2 = quantity;
            const fee2 = fee1;
            const totalAmount2 = totalAmount1;
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
            const type2 = 'convert-buy';
            const coin2 = baseCoin;
            const quantity2 = totalAmount;
            const rate2 = rate;
            const fee2 = fee * rate2 / 2;
            const amount2 = quantity2 * rate2;
            const totalAmount2 = amount2 - fee2;

            const type1 = 'convert-sell';
            const coin1 = transCoin;
            const quantity1 = quantity;
            const fee1 = fee2;
            const totalAmount1 = totalAmount2;
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
    const formattedConverts = await Promise.all(promise);
    console.log('processCoinbasePro formattedConverts - ', formattedConverts[0])

    // convert multidimensional array to single dimensional array
    const formattedBuySells = formattedConverts.reduce((accum, curr) => accum.concat(curr), [])
    console.log('processCoinbasePro formattedBuySells - ', formattedBuySells[0])


    // merge converts and pure buy/sells
    const document = [...formattedBuySells, ...buySells]
    console.log('processCoinbasePro document - ', document[1])

    return { status: 200, document }
}

module.exports = processCoinbasePro;
