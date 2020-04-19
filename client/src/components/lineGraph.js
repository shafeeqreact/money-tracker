import React from 'react'
import { Chart } from 'react-charts'

const LineGraph = ({ trans }) => {
    let quantity1 = 0
    const data1 = trans[0].transactions
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(tran => {
            (tran.type === 'buy' || tran.type === 'receive' || tran.type === 'convert-buy' ||
                tran.type === 'coinbase earn' || tran.type === 'rewards income') ?
                quantity1 += tran.totalAmount :
                quantity1 -= tran.totalAmount;
            return [new Date(tran.date), quantity1]
        })
    // console.log('LineGraph trans - ', data1)

    let quantity2 = 0;
    const data2 = trans[1].transactions
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(tran => {
            (tran.type === 'buy' || tran.type === 'receive' || tran.type === 'convert-buy' ||
                tran.type === 'coinbase earn' || tran.type === 'rewards income') ?
                quantity2 += tran.totalAmount :
                quantity2 -= tran.totalAmount;
            return [new Date(tran.date), quantity2]
        })

    const data = React.useMemo(
        () => [
            {
                // label: 'Series 1',
                label: 'LTC',
                // data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
                data: data1
            },
            {
                label: 'Series 2',
                // data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
                data: data2
            }
        ],
        []
    )

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'time', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    )

    const getSeriesStyle = React.useCallback(
        () => ({
            transition: 'all .5s ease'
        }),
        []
    )
    const getDatumStyle = React.useCallback(
        () => ({
            transition: 'all .5s ease'
        }),
        []
    )

    return (
        // A react-chart hyper-responsively and continuusly fills the available
        // space of its parent element automatically
        <div style={{ width: '100%', height: '300px' }} >
            <Chart
                data={data}
                axes={axes}
                getSeriesStyle={getSeriesStyle}
                getDatumStyle={getDatumStyle}
                tooltip
            />
        </div>
    )
}

export default LineGraph;