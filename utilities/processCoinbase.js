const csvtojson = require('csvtojson');

const processCoinbase = async (file, pathLocation) => {
    file.mv(pathLocation, async err => {
        if (err) {
            console.error(err);
            return { status: 500, err }
        }
    })

    const headers = ['date', 'type', 'coin', 'quantity', 'rate', 'amount', 'totalAmount', 'fee', 'notes']

    const jsonObj = await csvtojson({ noheader: false, headers }).fromFile(pathLocation)

    console.log('processCoinbase jsonObj - ', jsonObj[1])

    const transactions = jsonObj.filter(item => isNaN(parseFloat(item.quantity)) === false)

    if (!transactions) {
        return { status: 404, err: 'no transactions' };
    }

    // split the converts into buy/sells
    const converts = transactions.filter(item => item.type.toLowerCase() === 'convert')

    const buySells = converts.map(item => {
        const items = item.notes.split(' ');

        const sellQuantity = items[1].split(',').join('')
        const sellCoin = items[2].split(',').join('')
        const buyQuantity = items[4].split(',').join('')
        const buyCoin = items[5].split(',').join('')

        return [
            {
                exchange: 'Coinbase',
                date: item.date,
                type: 'convert-sell',
                coin: sellCoin.toUpperCase(),
                quantity: isNaN(parseFloat(sellQuantity)) ? 0 : parseFloat(sellQuantity),
                rate: isNaN(parseFloat(item.rate)) ? 0 : parseFloat(item.rate),
                totalAmount: isNaN(parseFloat(item.amount)) ? 0 : parseFloat(item.amount),
                amount: isNaN(parseFloat(item.totalAmount)) ? 0 : parseFloat(item.totalAmount),
                fee: isNaN(parseFloat(item.fee)) ? 0 : parseFloat(item.fee),
                notes: item.notes,
                createdAt: new Date(),
                lastUpdatedAt: new Date()
            },
            {
                exchange: 'Coinbase',
                date: item.date,
                type: 'convert-buy',
                coin: buyCoin.toUpperCase(),
                quantity: isNaN(parseFloat(buyQuantity)) ? 0 : parseFloat(buyQuantity),
                rate: isNaN(parseFloat(parseFloat(item.amount) / parseFloat(buyQuantity))) ? 0 : parseFloat(parseFloat(item.amount) / parseFloat(items[4])),
                amount: isNaN(parseFloat(item.amount)) ? 0 : parseFloat(item.amount),
                totalAmount: isNaN(parseFloat(item.amount)) ? 0 : parseFloat(item.amount),
                fee: 0,
                notes: item.notes,
                createdAt: new Date(),
                lastUpdatedAt: new Date()
            }
        ]
    })

    const buySellsMerged = buySells.reduce((prev, next) => prev.concat(next));

    // extract pure buy/sells 
    const pureBuySells = transactions.filter(item => item.type.toLowerCase() !== 'convert')

    const formattedPureBuySells = pureBuySells.map(item => {
        const date = item.date;
        const type = item.type.toLowerCase();
        const coin = item.coin.toUpperCase();
        const quantity = isNaN(parseFloat(item.quantity)) ? 0 : parseFloat(item.quantity);
        const rate = isNaN(parseFloat(item.rate)) ? 0 : parseFloat(item.rate);
        let amount = 0;
        let fee = 0;
        let totalAmount = 0;
        if (type === 'send' || type === 'receive') {
            amount = quantity * rate;
            fee = 0;
            totalAmount = amount + fee;
        } else {
            amount = isNaN(parseFloat(item.amount)) ? 0 : parseFloat(item.amount);
            fee = isNaN(parseFloat(item.fee)) ? 0 : parseFloat(item.fee);
            totalAmount = isNaN(parseFloat(item.totalAmount)) ? 0 : parseFloat(item.totalAmount);
        }
        const notes = item.notes;
        const createdAt = new Date();
        const lastUpdatedAt = new Date();

        return {
            exchange: 'Coinbase',
            date, type, coin, quantity, rate, amount, totalAmount, fee, notes, createdAt, lastUpdatedAt
        }
    })

    // merge converts and pure buy/sells
    const document = [...formattedPureBuySells, ...buySellsMerged]

    console.log('processCoinbase document - ', document[1])

    return { status: 200, document }
}

module.exports = processCoinbase;