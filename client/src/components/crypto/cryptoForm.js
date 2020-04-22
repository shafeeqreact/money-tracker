import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Input from '../common/input';
import FileUpload from './fileUpload';

const CryptoForm = (props) => {
    const [tran, setTran] = useState({});

    useEffect(() => {
        if (props.match.params.id) {
            const apiCall = async () => {
                const resp = await axios.get(`/api/investment/crypto/${props.match.params.id}`);
                console.log(resp)
                setTran(resp.data);
            }
            apiCall();
        } else {
            const d = new Date();
            const ccyy = d.getFullYear();
            const MM = d.getMonth() + 1 > 9 ? d.getMonth() : '0' + d.getMonth();
            const dd = d.getDay() > 9 ? d.getDay() : '0' + d.getDay();
            const hh = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
            const mm = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
            const ss = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();

            setTran({
                coin: "", name: "Enter Coin", exchange: "", type: "", date: `${ccyy}-${MM}-${dd}T${hh}:${mm}:${ss}Z`,
                quantity: 0, rate: 0, amount: 0, fee: 0, totalAmount: 0
            })
        }
    }, [props.match.params.id])

    const handleChange = (fieldName, value) => {
        let newTran = {};
        let date = '';

        switch (fieldName) {
            case 'coin':
                newTran = { ...tran, coin: value.toUpperCase() }
                switch (newTran.coin) {
                    case 'BTC':
                        newTran.name = 'Bitcoin'; break;
                    case 'LTC':
                        newTran.name = 'Litecoin'; break;
                    case 'ETH':
                        newTran.name = 'Etherium'; break;
                    case 'BCH':
                        newTran.name = 'Bitcoin Cash'; break;
                    default:
                        newTran.name = 'Invalid Coin';
                }
                break;
            case 'date':
                date = `${value}${tran.date.substring(10, 20)}`
                newTran = { ...tran, date }
                break;
            case 'hh':
                date = `${tran.date.substring(0, 11)}${value > 9 ? parseInt(value) : '0' + value}${tran.date.substring(13, 20)}`
                newTran = { ...tran, date }
                break;
            case 'mm':
                date = `${tran.date.substring(0, 14)}${value > 9 ? parseInt(value) : '0' + value}${tran.date.substring(16, 20)}`
                newTran = { ...tran, date }
                break;
            case 'ss':
                date = `${tran.date.substring(0, 17)}${value > 9 ? parseInt(value) : '0' + value}${tran.date.substring(19, 20)}`
                newTran = { ...tran, date }
                break;
            case 'type':
                newTran = { ...tran, type: value }
                break;
            case 'exchange':
                newTran = { ...tran, exchange: value }
                break;
            default:
                newTran = { ...tran, [fieldName]: parseFloat(value) }
                newTran.totalAmount = parseFloat(newTran.amount) + parseFloat(newTran.fee);
                newTran.rate = parseFloat(newTran.amount) / parseFloat(newTran.quantity)
        }

        setTran(newTran);
    }

    const handleSubmit = async () => {
        const document = { ...tran };
        document.date = new Date(tran.date);

        if (props.match.params.id) {
            const resp = await axios.put(`/api/investment/crypto/${props.match.params.id}`, document);
            // console.log(resp)
            props.history.push('/investments/crypto');
        } else {
            const resp = await axios.post('/api/investment/crypto', document)
            // console.log(resp)
            props.history.push('/investments/crypto');
        }
    }

    console.log(tran)

    return (
        <div className="d-flex justify-content-between" >
            <div className="mx-2" style={{ width: '30%' }}>
                <h5>Add Transaction:</h5>
                <Input label="Exchange" fieldName="exchange" value={tran.exchange} setValue={handleChange} type="text" placeholder="eg. Coinbase, Bittrex etc." />
                <Input label="Coin" fieldName="coin" value={tran.coin} setValue={handleChange} type="text" placeholder="eg. BTC, ETH, etc." />
                <div className="text-right text-weight-light" >
                    <span className={tran.name === 'Invalid Coin' ? "text-danger" : "text-info"} >{tran.name}</span>
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <label className="input-group-text" htmlFor="inputGroupSelect01">Type</label>
                    </div>
                    <select onChange={(e) => handleChange('type', e.target.value)} value={tran.type} className="custom-select" id="inputGroupSelect01">
                        <option value="">Choose...</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="receive">Receive</option>
                        <option value="send">Send</option>
                    </select>
                </div>
                <Input label="Date" fieldName="date" value={tran.date ? tran.date.substring(0, 10) : ''} setValue={handleChange} type="date" />
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Time</span>
                    </div>
                    <input onChange={e => handleChange('hh', e.target.value)} value={tran.date ? tran.date.substring(11, 13) : ''}
                        type='number' className="form-control text-right" aria-describedby='hh' placeholder='HH' />
                    <input onChange={e => handleChange('mm', e.target.value)} value={tran.date ? tran.date.substring(14, 16) : ''}
                        type='number' className="form-control text-right" aria-describedby='mm' placeholder='MM' />
                    <input onChange={e => handleChange('ss', e.target.value)} value={tran.date ? tran.date.substring(17, 19) : ''}
                        type='number' className="form-control text-right" aria-describedby='ss' placeholder='SS' />
                </div>
                <Input label="Quantity" fieldName="quantity" value={tran.quantity ? tran.quantity : 0} setValue={handleChange} type="number" />
                <Input label="Amount" fieldName="amount" value={tran.amount ? tran.amount : 0} setValue={handleChange} type="number" />
                <Input label="Fee" fieldName="fee" value={tran.fee ? tran.fee : 0} setValue={handleChange} type="number" />
                <Input label="Total" fieldName="totalAmount" value={tran.totalAmount ? tran.totalAmount : 0} type="number" editable={false} />
                <Input label="Rate" fieldName="rate" value={tran.rate ? tran.rate : 0} setValue={handleChange} type="number" />

                <button onClick={() => props.history.push('/investments/crypto')} type="button" className="btn btn-warning m-4">Back</button>
                <button onClick={handleSubmit} type="button" className="btn btn-primary m-4">Submit</button>
            </div>
            <div className="mx-2" style={{ width: '60%' }}>
                <FileUpload />
            </div>
        </div>
    );
}

export default CryptoForm;