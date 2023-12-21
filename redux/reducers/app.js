import {
    ROUTE_STATE_CHANGE,
    SCROLL_DISABLED_STATE_CHANGE
} from '../actionTypes'

const INITIAL_STATE = {
    route: {},
    scrollDisabled: false
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
        default:
            return state
    }
}