import React, { useState } from 'react';

import { toMoney } from '../../utilities/toMoney';

const CoinTableRow = (props) => {
    const { tran, handleDelete } = props;

    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="row my-1">
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12"
                onClick={() => setShowDetails(!showDetails)}>
                {/* For 'lg' and 'xl' screens */}
                <div className="d-none d-xl-block d-lg-block">
                    <div className="row">
                        <div className="col-4 text-left pr-0">
                            <span className="text-capitalize m-0">{tran.type}</span>
                        </div>
                        <div className="col-3 text-right">
                            <span className="m-0">{toMoney(tran.totalAmount)}</span>
                        </div>
                        <div className="col-5 text-right">
                            <span className="m-0">{tran.quantity.toFixed(8)}</span>
                        </div>
                    </div>
                </div>
                {/* For 'xs', 'sm' and 'md' screens */}
                <div className="d-block d-xl-none d-lg-none">
                    <div className="row">
                        <div className="col-4 px-1 text-left">
                            <span className="text-capitalize m-0">{tran.type}</span>
                        </div>
                        <div className="col-3 px-1 text-right">
                            <span className="m-0">{toMoney(tran.totalAmount)}</span>
                        </div>
                        <div className="col-5 px-1 text-right">
                            <span className="m-0">{tran.quantity.toFixed(8)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12">
                {/* For 'lg' and 'xl' screens */}
                <div className="d-none d-xl-block d-lg-block">
                    <div className="row">
                        <div className="col-4 px-1 text-right">
                            <span>{toMoney(tran.rate)}</span>
                        </div>
                        <div className="col-4 px-1 text-right">
                            <span>{toMoney(tran.fee)}</span>
                        </div>
                        <div className="col-4 px-1 text-right">
                            <span>{toMoney(tran.currValue)}</span>
                        </div>
                    </div>
                </div>
                {/* For 'xs', 'sm' and 'md' screens */}
                <div className={showDetails ? "d-block d-xl-none d-lg-none" : "d-none"}>
                    <div className="row">
                        <div className="col-4 px-1 text-left">
                            <small>Rate: {toMoney(tran.rate)}</small>
                        </div>
                        <div className="col-4 px-1 text-left">
                            <small>Fee: {toMoney(tran.fee)}</small>
                        </div>
                        <div className="col-4 px-1 text-left">
                            <small>Value: {toMoney(tran.currValue)}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                {/* For 'lg' and 'xl' screens */}
                <div className="d-none d-xl-block d-lg-block">
                    <div className="row">
                        <div className="col-8 px-1 text-center d-none d-xl-block d-lg-block">
                            <span>{new Date(tran.date).toString().substring(4, 24)}</span>
                        </div>
                        <div className="col-4 px-1 text-left d-none d-xl-block d-lg-block">
                            <span>{tran.exchange}</span>
                        </div>
                    </div>
                </div>
                {/* For 'xs', 'sm' and 'md' screens */}
                <div className={showDetails ? "d-block d-xl-none d-lg-none" : "d-none"}>
                    <div className="row">
                        <div className="col-8 px-1 text-left d-block d-xl-none d-lg-none">
                            <small>Date: {new Date(tran.date).toString().substring(4, 24)}</small>
                        </div>
                        <div className="col-4 px-1 text-left d-block d-xl-none d-lg-none">
                            <small>{tran.exchange}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col pl-1">
                {/* For 'lg' and 'xl' screens */}
                <div className="d-none d-xl-block d-lg-block">
                    <div className="row">
                        <div className="col-6 pr-0">
                            <button onClick={() => props.history.push(`/investments/crypto/${tran._id}`)}
                                className="btn btn-block btn-small rounded-0 p-0 btn-warning">Edit</button>
                        </div>
                        <div className="col-6 pl-0">
                            <button onClick={() => handleDelete(tran._id)}
                                className="btn btn-block btn-small rounded-0 p-0 btn-danger">Del</button>
                        </div>
                    </div>
                </div>
                {/* For 'xs', 'sm' and 'md' screens */}
                <div className={showDetails ? "d-block d-xl-none d-lg-none" : "d-none"}>
                    <div className="row">
                        <div className="col-6 pr-0">
                            <button onClick={() => props.history.push(`/investments/crypto/${tran._id}`)}
                                className="btn btn-block btn-small rounded-0 p-0 btn-warning">Edit</button>
                        </div>
                        <div className="col-6 pl-0 pr-1">
                            <button onClick={() => handleDelete(tran._id)}
                                className="btn btn-block btn-small rounded-0 p-0 btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoinTableRow;