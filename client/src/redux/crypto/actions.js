import axios from 'axios';

import { FETCH_CRYPTO_REQUEST, FETCH_CRYPTO_SUCCESS, FETCH_CRYPTO_FAILURE } from './types';
import { processData } from './processData';

export const fetchCryptoRequest = () => {
    return {
        type: FETCH_CRYPTO_REQUEST
    }
}

export const fetchCryptoSuccess = (data) => {
    return {
        type: FETCH_CRYPTO_SUCCESS,
        payload: data
    }
}

export const fetchCryptoFailure = (error) => {
    return {
        type: FETCH_CRYPTO_FAILURE,
        payload: error
    }
}

let interval;

export const fetchCrypto = () => {
    return async (dispatch) => {
        dispatch(fetchCryptoRequest());
        try {
            const response = await axios.get('/api/investment/crypto')
            if (response.status !== 200) {
                console.log('response - ', response)
                const error = { code: response.status, msg: response.error }
                dispatch(fetchCryptoFailure(error))
            } else {
                if (response.data && response.data.length !== 0) {
                    let calculatedData = await processData(response.data)
                    // console.log('/redux/crypto/actions calculatedData - ', calculatedData)
                    dispatch(fetchCryptoSuccess(calculatedData));

                    interval = setInterval(async () => {
                        calculatedData = await processData(response.data)
                        console.log('/redux/crypto/actions calculatedData - ', calculatedData)
                        dispatch(fetchCryptoSuccess(calculatedData));
                    }, 5000)
                } else {
                    const error = { code: 404, msg: 'no transactions' }
                    dispatch(fetchCryptoFailure(error))
                }
            }
        } catch (err) {
            console.log('err - ', err)
            const error = { code: 500, msg: err.response.statusText }
            dispatch(fetchCryptoFailure(error))
        }
    }
}

export const clearCurrentRateInterval = () => {
    clearInterval(interval)
}