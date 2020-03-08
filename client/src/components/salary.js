import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

const Salary = () => {
    const [salary, setSalary] = useState([])

    useEffect(() => {
        const callAPI = async () => {
            const resp = await axios.get('/api/income')
            // console.log(resp.data)
            setSalary(resp.data.data)
        }
        callAPI();
    })

    return (
        <CSSTransition
            in={salary.length}
            classNames="table"
            timeout={300}
        >
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th className='py-2' scope="col"></th>
                        {salary.map((mon, key) => <th className='py-2' scope="col" key={key} >Dec'07</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className='py-1' scope="row" colSpan='13'>E A R N I N G S</th>
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Basic</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.basic}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">HRA</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.hra}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Convynce Reimbmnt</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.conveyanceReimbursement}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Adhoc</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.adhoc}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Transport Allowance</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.transportAllowance}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">LTA Taxable</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.ltaTaxable}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Medical Taxable</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.medicalTaxable}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">ODC Bonus</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.earnings.odcBonus}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">TOTAL EARNINGS</th>
                        {salary.map((mon, key) => <th className='py-0' key={key} >{mon.totalEarnings}</th>)}
                    </tr>
                    <tr>
                        <th className='py-1' scope="row" colSpan='13'>D E D U C T I O N S</th>
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Provident Fund</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.deductions.providentFund}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Professional Tax</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.deductions.professionalTax}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">Welfare Fund</th>
                        {salary.map((mon, key) => <td className="py-0" key={key} >{mon.deductions.welfareFund}</td>)}
                    </tr>
                    <tr>
                        <th className='py-0' scope="row">TOTAL DEDUCTIONS</th>
                        {salary.map((mon, key) => <th className='py-0' key={key} >{mon.totalDeductions}</th>)}
                    </tr>
                    <tr>
                        <th className='py-1' scope="row" colSpan='13'>N E T - P A Y</th>
                    </tr>
                    <tr>
                        <th className='py-2' scope="row">NET EARNINGS</th>
                        {salary.map((mon, key) => <th className='py-2' key={key} >{mon.netPay}</th>)}
                    </tr>
                </tbody>
            </table>
        </CSSTransition>
    );
}

export default Salary;