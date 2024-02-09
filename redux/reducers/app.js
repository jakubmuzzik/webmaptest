import {
    ROUTE_STATE_CHANGE,
    SCROLL_DISABLED_STATE_CHANGE,
    STORE_TOAST_REF,
    LADIES_COUNT_CHANGE,
    MASSEUSES_COUNT_CHANGE,
    ESTABLISHMENTS_COUNT_CHANGE
} from '../actionTypes'

const INITIAL_STATE = {
    route: {},
    scrollDisabled: false,
    toastRef: undefined,
    ladiesCount: undefined,
    masseusesCount: undefined,
    establishmentsCount: undefined
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
        case LADIES_COUNT_CHANGE:
            return {
                ...state,
                ladiesCount: action.ladiesCount
            }
        case MASSEUSES_COUNT_CHANGE:
            return {
                ...state,
                masseusesCount: action.masseusesCount
            }
        case ESTABLISHMENTS_COUNT_CHANGE:
            return {
                ...state,
                establishmentsCount: action.establishmentsCount
            }
        default:
            return state
    }
}