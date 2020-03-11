import React from 'react';

const TableRow = ({ data, label }) => {
    return (
        <tr>
            <th className="py-0 px-1" scope="row">{label}</th>
            {data.map(item => <td className="py-0 px-1 text-right" key={item._id} >{item.earnings.basic}</td>)}
        </tr>
    );
}

export default TableRow;