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
    console.log(salary)
    return (
        <CSSTransition
            in={salary.length ? true : false}
            classNames="table"
            timeout={300}
        >
            <table className="table table-bordered mt-4">
                <thead>
                    {/* <TableRow data={salary.map(mon => mon.date)} tableHeader >
                        <div className="d-flex justify-content-around">
                            <FontAwesomeIcon icon={faEdit} className="clickable" color="blue" />
                            <FontAwesomeIcon icon={faTrashAlt} className="clickable" color="red" />
                        </div>
                    </TableRow> */}
                    <tr>
                        <th className="p-1" scope="col"></th>
                        {salary.map(mon =>
                            <th className="p-1 text-center" scope="col" key={mon._id}>
                                <div className="d-flex justify-content-around">
                                    <FontAwesomeIcon onClick={() => props.history.push(`/edit-salary/${mon._id}`)} icon={faEdit} className="clickable" color="blue" />{"  "}
                                    <FontAwesomeIcon onClick={() => handleDelete(mon._id)} icon={faTrashAlt} className="clickable" color="red" />
                                </div>
                                {mon.date}
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
        </CSSTransition>
    );
}

export default Salary;
