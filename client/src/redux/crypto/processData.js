import axios from 'axios';

export const processData = async (data) => {
    const promise = data.map(async coin => {
        // calculate 'quantity' holdings
        const quantityIn = coin.transactions.reduce((accum, tran) =>
            tran.type === 'buy' || tran.type === 'convert-buy' || tran.type === 'receive' ||
                tran.type === 'coinbase earn' || tran.type === 'rewards income' ?
                accum += tran.quantity : accum, 0)

        const quantityOut = coin.transactions.reduce((accum, tran) =>
            tran.type === 'sell' || tran.type === 'convert-sell' || tran.type === 'send' ?
                accum += tran.quantity : accum, 0)

        const quantity = (quantityIn - quantityOut) <= 0 ? 0 :
            Math.round(((quantityIn - quantityOut) + Number.EPSILON) * 100000000) / 100000000;

        // calculate 'buys' holdings
        const buys = coin.transactions.reduce((accum, tran) =>
            tran.type === 'buy' || tran.type === 'convert-buy' ? accum += tran.totalAmount : accum, 0)

        // calculate 'sells' holdings
        const sells = coin.transactions.reduce((accum, tran) =>
            tran.type === 'sell' || tran.type === 'convert-sell' ? accum += tran.totalAmount : accum, 0)

        let currentRate = 0;
        let totalAmount = 0;
        let avgRate = 0;
        let currentValue = 0;
        if (quantity === 0) {
            // set current rate to zero
            currentRate = 0;
            // calculate 'totalAmount' holdings
            totalAmount = Math.round(((buys) + Number.EPSILON) * 100) / 100;
            // calculate 'avgRate' holdings
            avgRate = Math.round(((totalAmount / quantityIn) + Number.EPSILON) * 100) / 100;
            // calculate 'currentValue' holdings
            currentValue = Math.round(((sells) + Number.EPSILON) * 100) / 100;
        } else {
            // get the current rate of the coin from Coinbase
            try {
                const respCoinbase = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${coin.coin}`)
                currentRate = parseFloat(respCoinbase.data.data.rates.USD)
            } catch (err) {
                console.log('coinbase err - ', err)
                currentRate = 0;
            }
            // calculate 'totalAmount' holdings
            totalAmount = Math.round(((buys - sells) + Number.EPSILON) * 100) / 100;
            // calculate 'avgRate' holdings
            avgRate = Math.round(((totalAmount / quantity) + Number.EPSILON) * 100) / 100;
            // calculate 'currentValue' holdings
            currentValue = quantity * currentRate;
            // substract 1% of fee on withdrawal/sale
            currentValue = currentValue - (currentValue * 1 / 100);
            currentValue = Math.round(((currentValue) + Number.EPSILON) * 100) / 100;
        }

        // calculate 'profit' holdings
        let profit = currentValue - totalAmount;
        profit = Math.round(((profit) + Number.EPSILON) * 100) / 100;

        // calculate 'profitPercentage' holdings
        let profitPercentage = totalAmount === 0 ? 100 : ((profit / totalAmount) * 100)
        profitPercentage = Math.round(((profitPercentage) + Number.EPSILON) * 100) / 100;

        return {
            coin: coin.coin,
            quantity,
            totalAmount,
            avgRate,
            currentRate,
            currentValue,
            profit,
            profitPercentage
        }
    })
    const holdings = await Promise.all(promise);

    // calculate 'totalInvestment' holdings
    let totalInvestment = holdings.reduce((accum, coin) => coin.quantity === 0 ?
        accum += (coin.totalAmount - coin.currentValue) : accum += coin.totalAmount, 0)
    totalInvestment = Math.round((totalInvestment + Number.EPSILON) * 100) / 100;

    // calculate 'totalCurrentValue' holdings
    let totalCurrentValue = holdings.reduce((accum, coin) => coin.quantity === 0 ? accum : accum += coin.currentValue, 0)
    totalCurrentValue = Math.round((totalCurrentValue + Number.EPSILON) * 100) / 100;

    // calculate 'totalProfit' holdings
    let totalProfit = totalCurrentValue - totalInvestment;
    totalProfit = Math.round((totalProfit + Number.EPSILON) * 100) / 100;

    // calculate 'totalProfitPercentage' holdings
    let totalProfitPercentage = totalInvestment === 0 ? 100 : ((totalProfit / totalInvestment) * 100)
    totalProfitPercentage = Math.round(((totalProfitPercentage) + Number.EPSILON) * 100) / 100;

    // format 'returns' 
    const returns = {
        totalInvestment,
        totalCurrentValue,
        totalProfit,
        totalProfitPercentage
    }

    // // sort data based on total investment
    // data = data.sort((a, b) => b.totalAmount - a.totalAmount);

    return {
        data,
        holdings,
        returns
    }
}