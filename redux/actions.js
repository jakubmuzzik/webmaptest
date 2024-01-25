import {
    ROUTE_STATE_CHANGE,
    SCROLL_DISABLED_STATE_CHANGE,
    SHOW_TOAST,
    USER_STATE_CHANGE,
    CLEAR_DATA,
    LADIES_STATE_CHANGE
} from './actionTypes'
import { getAuth, getDoc, doc, db, signOut } from '../firebase/config'

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

export const updateCurrentUserInRedux = (data) => ({
    type: USER_STATE_CHANGE,
    data
})

export const updateLadyInRedux = (data) => (dispatch, getState) => {
    let ladies = JSON.parse(JSON.stringify(getState().userState.ladies))

    let existingLady = ladies.filter(lady => lady.id === data.id)

    existingLady = existingLady.length ? {
        ...existingLady[0],
        ...data
    } : data

    ladies = ladies.concat(data)

    dispatch({ type: LADIES_STATE_CHANGE, ladies })
}

/**
 * 
 * @description Redux thunk functions
 */
export const fetchUser = () => (dispatch, getState) => {
    return getDoc(doc(db, 'users', getAuth().currentUser.uid))
        .then((snapshot) => {
            if (snapshot.exists()) {
                dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
            } else {
                dispatch(logOut())
            }
        })
}

export const logOut = () => (dispatch, getState) => {
    signOut(getAuth())
    dispatch({ type: CLEAR_DATA })
}