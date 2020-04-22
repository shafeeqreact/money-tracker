import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchCrypto, clearCurrentRateInterval } from '../../redux/crypto/actions';

import Returns from './returns';
import Holdings from './holdings';
import CoinTable from './coinTable';

const Crypto = (props) => {
    const { isLoading, data, error } = useSelector(state => state)
    const dispatch = useDispatch();

    const [showZeroes, setShowZeroes] = useState(false);

    useEffect(() => {
        dispatch(fetchCrypto());

        return () => {
            clearCurrentRateInterval()
        }
    }, [])

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error && error.code) {
        return (
            <div>Error - {error.msg}</div>
        )
    }

    const filterData = showZeroes ? data : data.filter(coin => coin.quantity !== 0);

    const coins = filterData.sort((a, b) => b.totalAmount - a.totalAmount)

    return (
        <div>
            {/* <div className="my-4">
                    <LineGraph trans={trans} />
                </div> */}
            <div className="row my-4">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <Returns />
                    <div className="d-flex justify-content-between my-4" >
                        <button className="btn btn-primary" onClick={() => props.history.push('/investments/crypto/add')}>Add Transaction</button>
                        <button className="btn btn-primary" onClick={() => setShowZeroes(!showZeroes)}>{showZeroes ? 'Hide Zeroes' : 'Show Zeroes'}</button>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <Holdings showZeroes={showZeroes} />
                </div>
            </div>
            {coins.map(coin =>
                <CoinTable key={coin.coin} coin={coin} {...props} />
            )}
        </div>
    );
}

export default Crypto;