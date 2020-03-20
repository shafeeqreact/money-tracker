import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Input from '../common/input';

const CryptoForm = (props) => {
    const [tran, setTran] = useState({});

    useEffect(() => {
        if (props.match.params.id) {
            const apiCall = async () => {
                const resp = await axios.get(`/api/investment/crypto/${props.match.params.id}`);
                console.log(resp)
                setTran(resp.data.data);
            }
            apiCall();
        } else {
            let tran = {
                date: '9999-99-99T23:59:99',
                type: '',
                quantity: 0,
                rate: 0,
                amount: 0,
                fee: 0,
                totalAmount: 0
            };
            setTran(tran);
        }
    }, [props.match.params.id])

    const handleDateChange = (fieldName, value) => setTran({ ...tran, [fieldName]: value });

    const handleChange = (fieldName, value) => {
        console.log(fieldName, value)
        const newTran = { ...tran, [fieldName]: parseFloat(value) }

        const totalAmount = newTran.amount + newTran.fee;

        setTran({ ...newTran, totalAmount: parseFloat(totalAmount) });
    }

    const handleSubmit = async () => {
        const document = { ...tran };
        document.date = new Date(tran.date);

        if (props.match.params.id) {
            const resp = await axios.put(`/api/investment/crypto/${props.match.params.id}`, document);
            console.log(resp)
            props.history.push('/investments/cryto');
        } else {
            const resp = await axios.post('/api/investment/crypto', document)
            console.log(resp)
            props.history.push('/investments/crypto');
        }
    }

    return (
        <div className="d-flex justify-content-between" >
            <div className="mx-2">
                <h5>Tran Details:</h5>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="inputGroupSelect01">Type</label>
                    </div>
                    <select onChange={e => setTran({ ...tran, type: e.target.value })} value={tran.type} className="custom-select" id="inputGroupSelect01">
                        <option value="">Choose...</option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                        <option value="Receive">Receive</option>
                        <option value="Send">Send</option>
                    </select>
                </div>
                <Input label="Date" fieldName="date" value={tran.date ? tran.date.substring(0, 16) : ''} setValue={handleDateChange} type="datetime-local" />
                <Input label="Quantity" fieldName="quantity" value={tran.quantity ? tran.quantity : 0} setValue={handleChange} type="number" />
                <Input label="Rate" fieldName="rate" value={tran.rate ? tran.rate : 0} setValue={handleChange} type="number" />
                <Input label="Amount" fieldName="amount" value={tran.amount ? tran.amount : 0} setValue={handleChange} type="number" />
                <Input label="Fee" fieldName="fee" value={tran.fee ? tran.fee : 0} setValue={handleChange} type="number" />
                <Input label="Total" fieldName="totalAmount" value={tran.totalAmount} type="number" editable={false} />
                <button onClick={() => props.history.push('/investments/crypto')} type="button" className="btn btn-warning m-4">Back</button>
                <button onClick={handleSubmit} type="button" className="btn btn-primary m-4">Submit</button>
            </div>
        </div>
    );
}

export default CryptoForm;