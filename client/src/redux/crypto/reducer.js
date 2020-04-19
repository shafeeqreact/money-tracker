import { FETCH_CRYPTO_REQUEST, FETCH_CRYPTO_SUCCESS, FETCH_CRYPTO_FAILURE } from "./types"

const initialState = {
    isLoading: true,
    data: [],
    holdings: [],
    returns: {},
    error: {}
}

const cryptoReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CRYPTO_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case FETCH_CRYPTO_SUCCESS:
            return {
                isLoading: false,
                data: action.payload.data,
                holdings: action.payload.holdings,
                returns: action.payload.returns,
                error: {}
            }
        case FETCH_CRYPTO_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export default cryptoReducer;