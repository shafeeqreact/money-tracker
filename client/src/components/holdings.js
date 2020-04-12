import React from 'react';

const Holdings = ({ trans }) => {
    console.log('holdings trans - ', trans)

    if (trans.length === 0)
        return (
            <div>Loading...</div>
        )

    return (
        <table className="table table-bordered mr-4">
            <thead className="thead-light">
                <tr>
                    <th scope="col" colSpan={6} className="align-middle m-2 text-center">
                        <h4 className="m-0" >H O L D I N G S</h4>
                    </th>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th scope="col" className="align-middle py-1 text-center"></th>
                    <th scope="col" className="align-middle py-1 text-center">Quantity</th>
                    <th scope="col" className="align-middle py-1 text-center">Avg Rate</th>
                    <th scope="col" className="align-middle py-1 text-center">Amount</th>
                    <th scope="col" className="align-middle py-1 text-center">Fee</th>
                </tr>
            </thead>
            <tbody>
                {trans.map(coin =>
                    <tr key={coin.coin}>
                        <th scope="row" className="align-middle py-0 text-center">{coin.coin}</th>
                        <td className="align-middle py-0 text-right">{coin.quantity.toFixed(8)}</td>
                        <td className="align-middle py-0 text-right">{coin.avgRate.toFixed(2)}</td>
                        <td className="align-middle py-0 text-right">{coin.amount.toFixed(2)}</td>
                        <td className="align-middle py-0 text-right">{coin.fee.toFixed(2)}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default Holdings;