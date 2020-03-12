import React from 'react';

const TableRow = ({ data=[], label="", header = false, trailer = false, length, tableHeader = false, children }) => {
    if (tableHeader)
        return (
            <tr>
                <th className="p-1" scope="col"></th>
                {data.map((item, key) =>
                    <th className="p-1 text-center" scope="col" key={key}>
                        {children}
                        {item}
                    </th>)}
            </tr>
        );

    if (header)
        return (
            <tr>
                <th className="py-0 px-1 text-center" scope="row" colSpan={length + 1}>{label}</th>
            </tr>
        );

    if (trailer)
        return (
            <tr>
                <th className="py-0 px-1" scope="row">{label}</th>
                {data.map((item, key) => <th className="py-0 px-1 text-right" key={key} >{item.toFixed(2)}</th>)}
            </tr>
        );

    return (
        <tr>
            <th className="py-0 px-1" scope="row">{label}</th>
            {data.map((item, key) => <td className="py-0 px-1 text-right" key={key} >{item.toFixed(2)}</td>)}
        </tr>
    );
}

export default TableRow;
