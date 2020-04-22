import React from 'react';
import { useSelector } from 'react-redux';

import { toMoney } from '../../utilities/toMoney';

const Returns = () => {
    const { isLoading, returns, error } = useSelector(state => state);
    const { totalInvestment, totalCurrentValue, totalProfit, totalProfitPercentage } = returns;

    if (isLoading)
        return (
            <div>Loading...</div>
        )

    if (error && error.code) {
        return (
            <div>Error - {error.msg}</div>
        )
    }

    const textColor = totalProfit < 0 ? "text-danger" : "text-success";

    return (
        <div className="card shadow my-2">
            <div className="card-header text-center">
                <h4 className="m-0">R E T U R N S</h4>
            </div>
            <div className="card-body">
                <div className="card-title text-center m-3">
                    <small className="font-weight-light">Percentage</small><br />
                    <h2 className={textColor}>{toMoney(totalProfitPercentage)}%</h2>
                </div>
                <div className="card-text d-flex justify-content-around my-3 mx-1 p-2">
                    <div className="text-center">
                        <small className="font-weight-light">Investment</small><br />
                        <h5>{toMoney(totalInvestment)}</h5>
                    </div>
                    <div className="text-center mx-3">
                        <small className="font-weight-light">Curr Value</small><br />
                        <h5>{toMoney(totalCurrentValue)}</h5>
                    </div>
                    <div className="text-center">
                        <small className="font-weight-light">Profit/Loss</small><br />
                        <h5 className={textColor}>{toMoney(totalProfit)}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Returns;