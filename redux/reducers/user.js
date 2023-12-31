import {
    USER_STATE_CHANGE
} from '../actionTypes'

const INITIAL_STATE = {
    currentUser: {}
}

export const user = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        default:
            return state;
    }
}