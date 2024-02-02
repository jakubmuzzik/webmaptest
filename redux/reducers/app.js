import {
    ROUTE_STATE_CHANGE,
    SCROLL_DISABLED_STATE_CHANGE,
    STORE_TOAST_REF
} from '../actionTypes'

const INITIAL_STATE = {
    route: {},
    scrollDisabled: false,
    toastRef: undefined
}

export const app = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ROUTE_STATE_CHANGE:
            return {
                ...state,
                route: action.route
            }
        case SCROLL_DISABLED_STATE_CHANGE:
            return {
                ...state,
                scrollDisabled: action.scrollDisabled
            }
        case STORE_TOAST_REF:
            return {
                ...state,
                toastRef: action.toastRef
            }
        default:
            return state
    }
}