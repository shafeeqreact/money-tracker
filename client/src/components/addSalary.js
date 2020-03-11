import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Input from '../common/input';

const AddSalary = () => {
    const [salary, setSalary] = useState({});

    useEffect(() => {
        const salary = {};
        salary.date = '9999-99-99';
        salary.basic = 0;
        salary.hra = 0;
        salary.conveyanceReimbursement = 0;
        salary.adhoc = 0;
        salary.transportAllowance = 0;
        salary.ltaTaxable = 0;
        salary.medicalTaxable = 0;
        salary.odcBonus = 0;
        salary.providentFund = 0;
        salary.professionalTax = 0;
        salary.welfareFund = 0;
        salary.totalEarnings = 0;
        salary.totalDeductions = 0;
        salary.netPay = 0;

        setSalary(salary);
    }, [])

    const handleDateChange = (fieldName, value) => setSalary({ ...salary, [fieldName]: value });

    const handleChange = (fieldName, value) => {
        const newSalary = { ...salary, [fieldName]: parseFloat(parseFloat(value).toFixed(2)) }

        const { basic, hra, conveyanceReimbursement, adhoc, transportAllowance, ltaTaxable, medicalTaxable, odcBonus,
            providentFund, professionalTax, welfareFund } = newSalary;

        const totalEarnings = basic + hra + conveyanceReimbursement + adhoc + transportAllowance + ltaTaxable + medicalTaxable + odcBonus;
        const totalDeductions = providentFund + professionalTax + welfareFund;
        const netPay = totalEarnings - totalDeductions;

        const calculatedSalary = {
            ...newSalary,
            totalEarnings: parseFloat(parseFloat(totalEarnings).toFixed(2)),
            totalDeductions: parseFloat(parseFloat(totalDeductions).toFixed(2)),
            netPay: parseFloat(parseFloat(netPay).toFixed(2))
        }

        setSalary(calculatedSalary);
    }

    const handleClick = async () => {
        const { date, basic, hra, conveyanceReimbursement, adhoc, transportAllowance, ltaTaxable, medicalTaxable, odcBonus,
            providentFund, professionalTax, welfareFund, totalEarnings, totalDeductions, netPay } = salary;

        const document = {
            date,
            earnings: { basic, hra, conveyanceReimbursement, adhoc, transportAllowance, ltaTaxable, medicalTaxable, odcBonus },
            deductions: { providentFund, professionalTax, welfareFund },
            totalEarnings,
            totalDeductions,
            netPay
        }

        const resp = await axios.post('/api/income', document)
        console.log(resp)
    }

    return (
        <div className="mt-4 d-flex justify-content-between" >
            <div className="mx-2">
                <h5>Earnings</h5>
                <Input label="Basic" fieldName="basic" value={salary.basic} setValue={handleChange} type="number" />
                <Input label="HRA" fieldName="hra" value={salary.hra} setValue={handleChange} type="number" />
                <Input label="Connveyance" fieldName="conveyanceReimbursement" value={salary.conveyanceReimbursement} setValue={handleChange} type="number" />
                <Input label="Adhoc" fieldName="adhoc" value={salary.adhoc} setValue={handleChange} type="number" />
                <Input label="Transport Allowance" fieldName="transportAllowance" value={salary.transportAllowance} setValue={handleChange} type="number" />
                <Input label="LTA Taxable" fieldName="ltaTaxable" value={salary.ltaTaxable} setValue={handleChange} type="number" />
                <Input label="Medical Taxable" fieldName="medicalTaxable" value={salary.medicalTaxable} setValue={handleChange} type="number" />
                <Input label="ODC Bonus" fieldName="odcBonus" value={salary.odcBonus} setValue={handleChange} type="number" />
            </div>
            <div className="mx-2">
                <h5>Deductions</h5>
                <Input label="Provident Fund" fieldName="providentFund" value={salary.providentFund} setValue={handleChange} type="number" />
                <Input label="Professional Tax" fieldName="professionalTax" value={salary.professionalTax} setValue={handleChange} type="number" />
                <Input label="Welfare Fund" fieldName="welfareFund" value={salary.welfareFund} setValue={handleChange} type="number" />
            </div>
            <div className="mx-2">
                <h5>Salary</h5>
                <Input label="Date" fieldName="date" value={salary.date} setValue={handleDateChange} type="date" />
                <div className="my-4" />
                <h5>Totals</h5>
                <Input label="Earnings" fieldName="totalEarnings" value={salary.totalEarnings} type="number" editable={false} />
                <Input label="Deductions" fieldName="totalDeductions" value={salary.totalDeductions} type="number" editable={false} />
                <Input label="Net Pay" fieldName="netPay" value={salary.netPay} type="number" editable={false} />
                <div className="my-4" />
                <button onClick={handleClick} type="button" className="btn btn-primary">Add Salary</button>
            </div>
        </div>
    );
}

export default AddSalary;
