import React from 'react';
import { useSelector } from 'react-redux';

const Holdings = ({ showZeroes }) => {
    const { isLoading, holdings, error } = useSelector(state => state);

    if (isLoading)
        return (
            <div>Loading...</div>
        )

    if (error && error.code) {
        return (
            <div>Error - {error.msg}</div>
        )
    }

    const filterHoldings = showZeroes ? holdings : holdings.filter(coin => coin.quantity !== 0);

    const coins = filterHoldings.sort((a, b) => b.totalAmount - a.totalAmount)

    return (
        <div className="card shadow my-2">
            <div className="card-header text-center">
                <h4 className="m-0">H O L D I N G S</h4>
            </div>
            <div className="card-body">
                {coins.map(coin =>
                    <div key={coin.coin}>
                        <div className="row">
                            <div className="col-4 card-title m-0 pr-0">
                                <div className="mb-2">
                                    <h4 className="m-0">{coin.coin}</h4>
                                </div>
                                <div className="text-right">
                                    <h5 className={(coin.profit) < 0 ? "m-0 text-danger" : "m-0 text-success"}>
                                        {coin.profitPercentage.toFixed(2)} %
                                    </h5>
                                    <div className="m-0">
                                        <small className={(coin.profit) < 0 ? "text-danger" : "text-success"}>
                                            {coin.profit.toFixed(2)} $
                                        </small>
                                    </div>
                                    <div className="m-0">
                                        <small>{coin.quantity.toFixed(8)}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="col-8 card-text">
                                <div className="row">
                                    <div className="col-6 text-right">
                                        <small className="font-weight-light">Curr Rate</small><br />
                                        <h5>{coin.currentRate.toFixed(2)}</h5>
                                    </div>
                                    <div className="col-6 text-right">
                                        <small className="font-weight-light">Curr Value</small><br />
                                        <h5>{coin.currentValue.toFixed(2)}</h5>
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    <div className="col-6 text-right">
                                        <small className="font-weight-light">Avg Rate</small><br />
                                        <h5>{coin.avgRate.toFixed(2)}</h5>
                                    </div>
                                    <div className="col-6 text-right">
                                        <small className="font-weight-light">Investment</small><br />
                                        <h5>{coin.totalAmount.toFixed(2)}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="m-1" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Holdings;