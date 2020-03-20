import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'


const Crypto = (props) => {
    const [trans, setTrans] = useState([]);

    useEffect(() => {
        const apiCall = async () => {
            const resp = await axios.get('/api/investment/crypto');
            console.log(resp)
            const trans = resp.data.data.sort((a, b) => new Date(a.date) - new Date(b.date))
            setTrans(trans);
        }
        apiCall();
    }, [])

    const handleDelete = async (id) => {
        const resp1 = await axios.delete(`/api/investment/crypto'${id}`);
        console.log(resp1)
        const resp = await axios.get('/api/investment/crypto')
        console.log(resp.data.data)
        setTrans(resp.data.data)
    }

    return (
        <Fragment>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col" colSpan="13" className="align-middle text-center">B I T C O I N</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="py-0 align-middle text-left" scope="col">Date</th>
                        <th className="py-0 align-middle text-left" scope="col">Type</th>
                        <th className="py-0 align-middle text-right" scope="col">Quantity</th>
                        <th className="py-0 align-middle text-right" scope="col">Rate</th>
                        <th className="py-0 align-middle text-right" scope="col">Amount</th>
                        <th className="py-0 align-middle text-right" scope="col">Fee</th>
                        <th className="py-0 align-middle text-right" scope="col">Total</th>
                        <th className="py-0 align-middle text-center" scope="col">Edit / Delete</th>
                    </tr>
                    {trans.map(tran =>
                        <tr key={tran._id} >
                            <td className="py-0 align-middle text-left">{tran.date}</td>
                            <td className="py-0 align-middle text-left">{tran.type}</td>
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
            <button className="btn btn-primary" onClick={() => props.history.push('/investments/crypto/add')}  >Add Investment</button>
        </Fragment>
    );
}

export default Crypto;