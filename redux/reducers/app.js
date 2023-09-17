import {
    ROUTE_STATE_CHANGE
} from '../actionTypes'

const INITIAL_STATE = {
    route: {}
}

export const app = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ROUTE_STATE_CHANGE:
            return {
                ...state,
                route: action.route
            }
        default:
            return state
    }
}