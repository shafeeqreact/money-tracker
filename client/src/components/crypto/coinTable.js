import React from 'react';

import CoinTableRow from './coinTableRow';

const CoinTable = (props) => {
    const { coin, handleDelete } = props;

    if (!coin)
        return;

    const trans = coin.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))

    return (
        <div className="card shadow my-4">
            <div className="card-header text-center pb-1">
                <h5 className="m-0">{coin.coin} - {coin.name}</h5>
                <hr className="my-1" />
                <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                        {/* For 'lg' and 'xl' screens */}
                        <div className="d-none d-xl-block d-lg-block">
                            <div className="row">
                                <div className="col-4 text-left pr-0">
                                    <b>Type</b>
                                </div>
                                <div className="col-3 text-right">
                                    <b>Amount</b>
                                </div>
                                <div className="col-5 text-right">
                                    <b>Quantity</b>
                                </div>
                            </div>
                        </div>
                        {/* For 'xs', 'sm' and 'md' screens */}
                        <div className="d-block d-xl-none d-lg-none">
                            <div className="row">
                                <div className="col-4 px-1 text-left">
                                    <b>Type</b>
                                </div>
                                <div className="col-3 px-1 text-right">
                                    <b>Amount</b>
                                </div>
                                <div className="col-5 px-1 text-right">
                                    <b>Quantity</b>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* For 'lg' and 'xl' screens only */}
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 d-none d-xl-block d-lg-block">
                        <div className="row">
                            <div className="col-4 px-1 text-right">
                                <b>Rate</b>
                            </div>
                            <div className="col-4 px-1 text-right">
                                <b>Fee</b>
                            </div>
                            <div className="col-4 px-1 text-right">
                                <b>Value</b>
                            </div>
                        </div>
                    </div>
                    {/* For 'lg' and 'xl' screens only */}
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12 d-none d-xl-block d-lg-block">
                        <div className="row">
                            <div className="col-8 px-1 text-center">
                                <b>Date</b>
                            </div>
                            <div className="col-4 px-1 text-left">
                                <b>Exchange</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body pt-1">
                {trans.map(tran =>
                    <div key={tran._id}>
                        <CoinTableRow tran={tran} handleDelete={handleDelete} />
                        <hr className="m-1" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoinTable;