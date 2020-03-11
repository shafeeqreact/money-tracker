import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import TableRow from '../common/tableRow';

const Salary = (props) => {
    const [salary, setSalary] = useState([])

    useEffect(() => {
        const callAPI = async () => {
            const resp = await axios.get('/api/income')
            console.log(resp.data.data)
            setSalary(resp.data.data)
        }
        callAPI();
    }, [])

    const handleDelete = async (id) => {
        const resp1 = await axios.delete(`/api/income/${id}`);
        console.log(resp1)
        const resp = await axios.get('/api/income')
        console.log(resp.data.data)
        setSalary(resp.data.data)
    }

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
                        {salary.map(mon =>
                            <th className="p-1 text-center" scope="col" key={mon._id}>
                                <FontAwesomeIcon onClick={() => props.history.push(`/edit-salary/${mon._id}`)} icon={faEdit} className="clickable" color="blue" />{"  "}
                                <FontAwesomeIcon onClick={() => handleDelete(mon._id)} icon={faTrashAlt} className="clickable" color="red" />
                                <br />
                                {mon.date}
                            </th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="py-0 px-1 text-center" scope="row" colSpan={salary.length + 1}>E A R N I N G S</th>
                    </tr>
                    <TableRow data={salary} label="Basic" />
                    <tr>
                        <th className="py-0 px-1" scope="row">Basic</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.basic}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">HRA</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.hra}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Convynce Reimbmnt</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.conveyanceReimbursement}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Adhoc</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.adhoc}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Transport Allowance</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.transportAllowance}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">LTA Taxable</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.ltaTaxable}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Medical Taxable</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.medicalTaxable}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">ODC Bonus</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.earnings.odcBonus}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">TOTAL EARNINGS</th>
                        {salary.map(mon => <th className="py-0 px-1 text-right" key={mon._id} >{mon.totalEarnings}</th>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1 text-center" scope="row" colSpan={salary.length + 1}>D E D U C T I O N S</th>
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Provident Fund</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.deductions.providentFund}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Professional Tax</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.deductions.professionalTax}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">Welfare Fund</th>
                        {salary.map(mon => <td className="py-0 px-1 text-right" key={mon._id} >{mon.deductions.welfareFund}</td>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">TOTAL DEDUCTIONS</th>
                        {salary.map(mon => <th className="py-0 px-1 text-right" key={mon._id} >{mon.totalDeductions}</th>)}
                    </tr>
                    <tr>
                        <th className="py-0 px-1 text-center" scope="row" colSpan={salary.length + 1}>N E T - P A Y</th>
                    </tr>
                    <tr>
                        <th className="py-0 px-1" scope="row">NET EARNINGS</th>
                        {salary.map(mon => <th className="py-0 px-1 text-right" key={mon._id} >{mon.netPay}</th>)}
                    </tr>
                </tbody>
            </table>
        </CSSTransition>
    );
}

export default Salary;