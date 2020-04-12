import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const CoinTable = (props) => {
    const { coin, handleDelete } = props;

    if (!coin)
        return (
            <div>Loading...</div>
        )

    const trans = coin.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <table className="table table-striped mt-4">
            <thead className="thead-light">
                <tr>
                    <th scope="col" colSpan="13" className="align-middle text-center">
                        <h4 className="m-0">{coin.coin} - {coin.name}</h4>
                    </th>
                </tr>
            </thead>
            <thead>
                <tr>
                    <th className="py-0 align-middle text-left" scope="col">Exchange</th>
                    <th className="py-0 align-middle text-left" scope="col">Date</th>
                    <th className="py-0 align-middle text-left" scope="col">Type</th>
                    <th className="py-0 align-middle text-right" scope="col">Quantity</th>
                    <th className="py-0 align-middle text-right" scope="col">Rate</th>
                    <th className="py-0 align-middle text-right" scope="col">Amount</th>
                    <th className="py-0 align-middle text-right" scope="col">Fee</th>
                    <th className="py-0 align-middle text-right" scope="col">Total</th>
                    <th className="py-0 align-middle text-center" scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {trans.map(tran =>
                    <tr key={tran._id} >
                        <td className="py-0 align-middle text-left">{tran.exchange}</td>
                        <td className="py-0 align-middle text-left">{tran.date}</td>
                        <td className="py-0 align-middle text-left text-capitalize">{tran.type}</td>
                        <td className="py-0 align-middle text-right">{tran.quantity.toFixed(8)}</td>
                        <td className="py-0 align-middle text-right">{tran.rate.toFixed(8)}</td>
                        <td className="py-0 align-middle text-right">{tran.amount.toFixed(2)}</td>
                        <td className="py-0 align-middle text-right">{tran.fee.toFixed(2)}</td>
                        <td className="py-0 align-middle text-right">{tran.totalAmount.toFixed(2)}</td>
                        <td className="py-0 align-middle text-right">
                            <div className="d-flex justify-content-around">
                                <FontAwesomeIcon onClick={() => props.history.push(`/investments/crypto/${tran._id}`)} icon={faEdit} className="clickable" />
                                <FontAwesomeIcon onClick={() => handleDelete(tran._id)} icon={faTrashAlt} className="clickable" />
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default CoinTable;