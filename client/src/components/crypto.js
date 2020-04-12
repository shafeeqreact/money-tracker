import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

import Holdings from './holdings';
import Returns from './returns';
import CoinTable from './coinTable';

const Crypto = (props) => {
    const [data, setData] = useState([]);
    // const [trans, setTrans] = useState([]);
    const [showZeroes, setShowZeroes] = useState(false);

    useEffect(() => {
        const apiCall = async () => {
            const resp = await axios.get('/api/investment/crypto');
            console.log('crypto resp.data - ', resp.data)
            setData(resp.data.sort((a, b) => b.amount - a.amount))
        }
        apiCall();
    }, [])

    const handleDelete = async (id) => {
        const resp1 = await axios.delete(`/api/investment/crypto/${id}`);
        console.log(resp1)
        const resp = await axios.get('/api/investment/crypto')
        console.log(resp)
        setData(resp.data);
    }

    let trans = data;
    if (!showZeroes) {
        trans = data.filter(coin => coin.quantity !== 0);
    }
    console.log('crypto trans - ', trans)
    // setTrans(trans);

    if (trans.length === 0)
        return (
            <div>
                <h5 className="text-center"> No Transactions...</h5>
                <div className="d-flex justify-content-between" >
                    <button className="btn btn-primary" onClick={() => props.history.push('/investments/crypto/add')}>Add Transaction</button>
                    <button className="btn btn-primary" onClick={() => setShowZeroes(!showZeroes)}>{showZeroes ? 'Hide Zeroes' : 'Show Zeroes'}</button>
                </div>
            </div>
        )

    const headersOnly = trans.map(tran => {
        return {
            coin: tran.coin,
            name: tran.name,
            exchange: tran.exchange,
            quantity: tran.quantity,
            amount: tran.amount,
            fee: tran.fee,
            totalAmount: tran.totalAmount,
            avgRate: tran.avgRate
        }
    });

    return (
        <Fragment>
            <div className="d-flex justify-content-between" >
                <Holdings trans={headersOnly} />
                <Returns trans={headersOnly} />
            </div>
            <div>
                <div className="d-flex justify-content-between" >
                    <button className="btn btn-primary" onClick={() => props.history.push('/investments/crypto/add')}>Add Transaction</button>
                    <button className="btn btn-primary" onClick={() => setShowZeroes(!showZeroes)}>{showZeroes ? 'Hide Zeroes' : 'Show Zeroes'}</button>
                </div>
                {trans.map(coin => <CoinTable key={coin.coin} coin={coin} handleDelete={handleDelete} {...props} />)}
            </div>
        </Fragment>
    );
}

export default Crypto;