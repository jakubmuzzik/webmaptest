import {
    ROUTE_STATE_CHANGE,
    USER_STATE_CHANGE
} from './actionTypes'

export const updateRoute = (route) => ({
    type: ROUTE_STATE_CHANGE,
    route
})