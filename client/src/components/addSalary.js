import React, { useState } from 'react';
import axios from 'axios';

import Input from '../common/input';

const AddSalary = () => {
    const initialValue = {
        date: '99/99/9999',
        // earnings: {
        basic: 0,
        hra: 0,
        conveyanceReimbursement: 0,
        adhoc: 0,
        transportAllowance: 0,
        ltaTaxable: 0,
        medicalTaxable: 0,
        odcBonus: 0,
        // },
        // deductions: {
        providentFund: 0,
        professionalTax: 0,
        welfareFund: 0,
        // },
        totalEarnings: 0,
        totalDeductions: 0,
        netPay: 0
    }

    const [salary, setSalary] = useState({});

    const handleChange = (fieldName, value) => {
        setSalary({ ...salary, [fieldName]: value })
    }

    const handleClick = async () => {
        console.log(salary)
        const document = {
            date: '99/99/9999',
            earnings: {
                basic: salary.basic,
                hra: salary.hra,
                conveyanceReimbursement: salary.conveyanceReimbursement,
                adhoc: salary.adhoc,
                transportAllowance: salary.transportAllowance,
                ltaTaxable: salary.ltaTaxable,
                medicalTaxable: salary.medicalTaxable,
                odcBonus: salary.odcBonus,
            },
            deductions: {
                providentFund: salary.providentFund,
                professionalTax: salary.professionalTax,
                welfareFund: salary.welfareFund,
            },
            totalEarnings: salary.totalEarnings,
            totalDeductions: salary.totalDeductions,
            netPay: salary.netPay
        }
        const resp = await axios.post('/api/income', document)
        console.log(resp)
    }

    return (
        <div className="mt-4 d-flex justify-content-between" >
            <div className="mx-2">
                <h5>Salary</h5>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Date</span>
                    </div>
                    <input value={initialValue.date} type="date" className="form-control text-right" aria-describedby="basic-addon3" />
                </div>
                <div className="my-4" />
                <h5>Totals</h5>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Earnings</span>
                    </div>
                    <span className="form-control text-right">{initialValue.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Deductions</span>
                    </div>
                    <span className="form-control text-right">{initialValue.totalDeductions.toFixed(2)}</span>
                </div>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <span className="input-group-text">Net Pay</span>
                    </div>
                    <span className="form-control text-right">{initialValue.netPay.toFixed(2)}</span>
                </div>
                <div className="my-4" />
                <button onClick={handleClick} type="button" className="btn btn-primary">Add Salary</button>
            </div>
            <div className="mx-2">
                <h5>Earnings</h5>
                <Input label="Basic" fieldName="basic" value={salary.basic} setValue={handleChange} type="number" />
                <Input label="HRA" fieldName="hra" value={salary.hra} setValue={handleChange} type="number" />
                <Input label="Connveyance" fieldName="conveyanceReimbursement" value={salary.conveyanceReimbursement} setValue={handleChange} type="number" />
                <Input label="Adhoc" fieldName="adhoc" value={salary.adhoc} setValue={handleChange} type="number" />
                <Input label="TransportAllowance" fieldName="transportAllowance" value={salary.transportAllowance} setValue={handleChange} type="number" />
                <Input label="LTATaxable" fieldName="ltaTaxable" value={salary.ltaTaxable} setValue={handleChange} type="number" />
                <Input label="MedicalTaxable" fieldName="medicalTaxable" value={salary.medicalTaxable} setValue={handleChange} type="number" />
                <Input label="ODCBonus" fieldName="odcBonus" value={salary.odcBonus} setValue={handleChange} type="number" />
            </div>
            <div className="mx-2">
                <h5>Deductions</h5>
                <Input label="ProvidentFund" fieldName="providentFund" value={salary.providentFund} setValue={handleChange} type="number" />
                <Input label="ProfessionalTax" fieldName="professionalTax" value={salary.professionalTax} setValue={handleChange} type="number" />
                <Input label="WelfareFund" fieldName="welfareFund" value={salary.welfareFund} setValue={handleChange} type="number" />
            </div>
        </div>
    );
}

export default AddSalary;