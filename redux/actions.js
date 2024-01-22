import {
    ROUTE_STATE_CHANGE,
    SCROLL_DISABLED_STATE_CHANGE,
    SHOW_TOAST,
    USER_STATE_CHANGE
} from './actionTypes'

export const updateRoute = (route) => ({
    type: ROUTE_STATE_CHANGE,
    route
})

export const updateScrollDisabled = (scrollDisabled) => ({
    type: SCROLL_DISABLED_STATE_CHANGE,
    scrollDisabled
})

export const showToast = (toastData) => ({
    type: SHOW_TOAST,
    toastData
})

export const updateCurrentUser = (data) => ({
    type: USER_STATE_CHANGE,
    data
})