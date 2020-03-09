import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

const Salary = () => {
    const [salary, setSalary] = useState([])

    useEffect(() => {
        const callAPI = async () => {
            const resp = await axios.get('/api/income')
            setSalary(resp.data.data)
        }
        callAPI();
    })

    return (
        <CSSTransition
            in={salary.length ? true : false}
            classNames="table"
            timeout={300}
        >
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th className="p-1" scope="col"></th>
                        {salary.map((mon, key) => <th className="p-1 text-center" scope="col" key={key} >Dec'07</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="py-0 px-1 text-center" scope="row" colSpan={salary.length + 1}>E A R N I N G S</th>
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Basic</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.basic)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">HRA</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.hra)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Convynce Reimbmnt</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.conveyanceReimbursement)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Adhoc</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.adhoc)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Transport Allowance</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.transportAllowance)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">LTA Taxable</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.ltaTaxable)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Medical Taxable</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.medicalTaxable)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">ODC Bonus</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.earnings.odcBonus)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">TOTAL EARNINGS</th>
                        {salary.map((mon, key) => <th className="py-0 px-1 text-right" key={key} >{Math.round(mon.totalEarnings)}</th>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1 text-center" scope="row" colSpan={salary.length + 1}>D E D U C T I O N S</th>
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Provident Fund</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.deductions.providentFund)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Professional Tax</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.deductions.professionalTax)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Welfare Fund</th>
                        {salary.map((mon, key) => <td className="py-0 px-1 text-right" key={key} >{Math.round(mon.deductions.welfareFund)}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">TOTAL DEDUCTIONS</th>
                        {salary.map((mon, key) => <th className="py-0 px-1 text-right" key={key} >{Math.round(mon.totalDeductions)}</th>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1 text-center" scope="row" colSpan={salary.length + 1}>N E T - P A Y</th>
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">NET EARNINGS</th>
                        {salary.map((mon, key) => <th className="py-0 px-1 text-right" key={key} >{Math.round(mon.netPay)}</th>)}
                    </tr>
                </tbody>
            </table>
        </CSSTransition>
    );
}

export default Salary;