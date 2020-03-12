import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Input from '../common/input';

const SalaryForm = (props) => {
    const [salary, setSalary] = useState({});

    useEffect(() => {
        if(props.match.params.id){
            const apiCall = async () => {
                const resp = await axios.get(`/api/income/${props.match.params.id}`);
                console.log(resp)
                const currentSalary = resp.data.data;
                setSalary(currentSalary);
            }
            apiCall();
        }else{
            const salary = {};
            salary.date = '9999-99-99';
            salary.earnings={};
            salary.earnings.basic = 0;
            salary.earnings.hra = 0;
            salary.earnings.conveyanceReimbursement = 0;
            salary.earnings.adhoc = 0;
            salary.earnings.transportAllowance = 0;
            salary.earnings.ltaTaxable = 0;
            salary.earnings.medicalTaxable = 0;
            salary.earnings.odcBonus = 0;
            salary.deductions={};
            salary.deductions.providentFund = 0;
            salary.deductions.professionalTax = 0;
            salary.deductions.welfareFund = 0;
            salary.totalEarnings = 0;
            salary.totalDeductions = 0;
            salary.netPay = 0;
            setSalary(salary);
        }
    }, [props.match.params.id])

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

    const handleSubmit = async () => {
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

        if(props.match.params.id){
            const resp = await axios.put(`/api/income/${props.match.params.id}`,document);
            console.log(resp)
        } else {
            const resp = await axios.post('/api/income', document)
            console.log(resp)
        }
    }
    console.log(salary)
    if(!salary.date)
        return null;

    return (
        <div className="mt-4 d-flex justify-content-between" >
            <div className="mx-2">
                <h5>Earnings</h5>
                <Input label="Basic" fieldName="basic" value={salary.earnings.basic?salary.earnings.basic:0} setValue={handleChange} type="number" />
                <Input label="HRA" fieldName="hra" value={salary.earnings.hra?salary.earnings.hra:0} setValue={handleChange} type="number" />
                <Input label="Connveyance" fieldName="conveyanceReimbursement" value={salary.earnings.conveyanceReimbursement?salary.earnings.conveyanceReimbursement:0} setValue={handleChange} type="number" />
                <Input label="Adhoc" fieldName="adhoc" value={salary.earnings.adhoc?salary.earnings.adhoc:0} setValue={handleChange} type="number" />
                <Input label="Transport Allowance" fieldName="transportAllowance" value={salary.earnings.transportAllowance?salary.earnings.transportAllowance:0} setValue={handleChange} type="number" />
                <Input label="LTA Taxable" fieldName="ltaTaxable" value={salary.earnings.ltaTaxable?salary.earnings.ltaTaxable:0} setValue={handleChange} type="number" />
                <Input label="Medical Taxable" fieldName="medicalTaxable" value={salary.earnings.medicalTaxable?salary.earnings.medicalTaxable:0} setValue={handleChange} type="number" />
                <Input label="ODC Bonus" fieldName="odcBonus" value={salary.earnings.odcBonus?salary.earnings.odcBonus:0} setValue={handleChange} type="number" />
            </div>
            <div className="mx-2">
                <h5>Deductions</h5>
                <Input label="Provident Fund" fieldName="providentFund" value={salary.deductions.providentFund?salary.deductions.providentFund:0} setValue={handleChange} type="number" />
                <Input label="Professional Tax" fieldName="professionalTax" value={salary.deductions.professionalTax?salary.deductions.professionalTax:0} setValue={handleChange} type="number" />
                <Input label="Welfare Fund" fieldName="welfareFund" value={salary.deductions.welfareFund?salary.deductions.welfareFund:0} setValue={handleChange} type="number" />
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
                <button onClick={handleSubmit} type="button" className="btn btn-primary">Submit</button>
            </div>
        </div>
    );
}

export default SalaryForm;
