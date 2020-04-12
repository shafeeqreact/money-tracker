import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Returns = ({ trans }) => {
    const [returns, setReturns] = useState([]);

    useEffect(() => {
        const apiCall = async () => {
            const promise = trans.map(async (coin) => {
                let currentRate = 0;
                if (coin.coin !== 'undefined' || coin.quantity !== 0) {
                    try {
                        const respCoinbase = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${coin.coin}`)
                        currentRate = parseFloat(respCoinbase.data.data.rates.USD)
                    } catch (err) {
                        currentRate = 0
                    }
                }
                // console.log(`${coin.coin} - ${coin.quantity} - ${currentRate}`);
                const totalReturns = coin.quantity * currentRate;
                const feeOnReturns = totalReturns * 1 / 100;
                const profit = totalReturns - coin.totalAmount - feeOnReturns;

                return {
                    coin: coin.coin,
                    currentRate,
                    quantity: coin.quantity,
                    totalAmount: coin.totalAmount,
                    totalReturns,
                    feeOnReturns,
                    profit
                }
            })

            const returns = await Promise.all(promise);
            // console.log('-------------------------')
            setReturns(returns)
        }

        const time = 1000 * 5;

        apiCall();
        const interval = setInterval(() => {
            apiCall();
        }, time)

        return () => {
            clearInterval(interval)
        }
    }, [trans])

    // console.log('returns - ', returns)

    if (returns.length === 0)
        return (
            <div>Loading...</div>
        )

    return (
        <table className="table table-bordered ml-4">
            <thead className="thead-light">
                <tr>
                    <th scope="col" colSpan={6} className="align-middle m-2 text-center">
                        <h4 className="m-0">R E T U R N S</h4>
                    </th>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th scope="col" className="align-middle py-1 text-center"></th>
                    <th scope="col" className="align-middle py-1 text-center">Curr Rate</th>
                    <th scope="col" className="align-middle py-1 text-center">Investment</th>
                    <th scope="col" className="align-middle py-1 text-center">Returns</th>
                    <th scope="col" className="align-middle py-1 text-center">Profit</th>
                </tr>
            </thead>
            <tbody>
                {returns.map(coin =>
                    <tr key={coin.coin}>
                        <th scope="row" className="align-middle py-0 text-center">{coin.coin}</th>
                        <td className="align-middle py-0 text-right">{coin.currentRate.toFixed(2)}</td>
                        <td className="align-middle py-0 text-right">{coin.totalAmount.toFixed(2)}</td>
                        <td className="align-middle py-0 text-right">{coin.totalReturns.toFixed(2)}</td>
                        <td className="align-middle py-0 text-right">{coin.profit.toFixed(2)}</td>
                    </tr>
                )}
                <tr>
                    <th scope="row" colSpan="2" className="align-middle py-0 text-center">T O T A L</th>
                    <th className="align-middle py-0 text-right">{returns.reduce((accum, curr) => accum + curr.totalAmount, 0).toFixed(2)}</th>
                    <th className="align-middle py-0 text-right">{returns.reduce((accum, curr) => accum + curr.totalReturns, 0).toFixed(2)}</th>
                    <th className="align-middle py-0 text-right">{returns.reduce((accum, curr) => accum + curr.profit, 0).toFixed(2)}</th>
                </tr>
            </tbody>
        </table>
    );
}

export default Returns;