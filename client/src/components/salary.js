import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { CSSTransition } from 'react-transition-group';

import Loading from '../common/loading';
import TableRow from '../common/tableRow';

import reformatDate from '../utilities/reformatDate';

const Salary = (props) => {
    const [salary, setSalary] = useState([])

    useEffect(() => {
        const callAPI = async () => {
            const resp = await axios.get('/api/income/salary')
            console.log('resp - ', resp)
            const sortedSalary = resp.data.data.sort((a, b) => new Date(a.date) - new Date(b.date))
            setSalary(sortedSalary)
        }
        callAPI();
    }, [])

    const handleDelete = async (id) => {
        const resp1 = await axios.delete(`/api/income/salary/${id}`);
        console.log(resp1)
        const resp = await axios.get('/api/income/salary')
        console.log(resp.data.data)
        setSalary(resp.data.data)
    }

    console.log(salary)

    return (
        <CSSTransition
            in={salary.length ? true : false}
            classNames="table"
            timeout={300}
        >
            {(!salary.length) ?
                <Loading /> :
                <div>
                    <table className="table table-bordered">
                        <thead>
                            <TableRow label="2 0 0 7 - 2 0 0 8" length={salary.length} tableHeader />
                            <tr>
                                <th className="p-1" scope="col"></th>
                                {salary.map(mon =>
                                    <th className="p-1 text-center" scope="col" key={mon._id}>
                                        <div className="d-flex justify-content-around mb-1">
                                            <FontAwesomeIcon onClick={() => props.history.push(`/income/salary/${mon._id}`)} icon={faEdit} className="clickable" />
                                            <FontAwesomeIcon onClick={() => handleDelete(mon._id)} icon={faTrashAlt} className="clickable" />
                                        </div>
                                        <span>{reformatDate(mon.date)}</span>
                                    </th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow label="E A R N I N G S" length={salary.length} header />
                            <TableRow data={salary.map(mon => mon.earnings.basic)} label="Basic" />
                            <TableRow data={salary.map(mon => mon.earnings.hra)} label="HRA" />
                            <TableRow data={salary.map(mon => mon.earnings.conveyanceReimbursement)} label="Conveyance Reimbrsmt" />
                            <TableRow data={salary.map(mon => mon.earnings.adhoc)} label="Adhoc" />
                            <TableRow data={salary.map(mon => mon.earnings.transportAllowance)} label="Transport Allowance" />
                            <TableRow data={salary.map(mon => mon.earnings.ltaTaxable)} label="LTA Taxable" />
                            <TableRow data={salary.map(mon => mon.earnings.medicalTaxable)} label="Medical Taxable" />
                            <TableRow data={salary.map(mon => mon.earnings.odcBonus)} label="ODC Bonus" />
                            <TableRow data={salary.map(mon => mon.totalEarnings)} label="TOTAL EARNINGS" trailer />

                            <TableRow label="D E D U C T I O N S" length={salary.length} header />
                            <TableRow data={salary.map(mon => mon.deductions.providentFund)} label="Provident Fund" />
                            <TableRow data={salary.map(mon => mon.deductions.professionalTax)} label="Professional Tax" />
                            <TableRow data={salary.map(mon => mon.deductions.welfareFund)} label="Welfare Fund" />
                            <TableRow data={salary.map(mon => mon.totalDeductions)} label="TOTAL DEDUCTIONS" trailer />

                            <TableRow label="N E T - P A Y" length={salary.length} header />
                            <TableRow data={salary.map(mon => mon.netPay)} label="NET EARNINGS" trailer />
                        </tbody>
                    </table>
                    <nav className="d-flex justify-content-center" aria-label="...">
                        <ul className="pagination pagination-sm">
                            <li className="page-item"><span className="page-link">2017</span></li>
                            <li className="page-item active"><span className="page-link">2018</span></li>
                            <li className="page-item"><span className="page-link">2019</span></li>
                            <li className="page-item"><span className="page-link">2020</span></li>
                            <li className="page-item"><span className="page-link">2021</span></li>
                        </ul>
                    </nav>
                    <button className="btn btn-primary" onClick={() => props.history.push('/income/salary/add')}>Add Salary</button>
                </div>
            }
        </CSSTransition>
    );
}

export default Salary;
