import {
    ROUTE_STATE_CHANGE,
    SCROLL_DISABLED_STATE_CHANGE,
    SHOW_TOAST,
    USER_STATE_CHANGE,
    CLEAR_DATA,
    LADIES_STATE_CHANGE
} from './actionTypes'
import { getAuth, getDoc, doc, db, signOut, getDocs, query, collection, where } from '../firebase/config'

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

//either independent lady or establishemtn
export const updateCurrentUserInRedux = (data) => ({
    type: USER_STATE_CHANGE,
    data
})

//lady under establishment
export const updateLadyInRedux = (data) => (dispatch, getState) => {
    let ladies = getState().userState.ladies ? JSON.parse(JSON.stringify(getState().userState.ladies)) : []

    let existingLady = ladies.find(lady => lady.id === data.id)

    if (existingLady) {
        ladies = ladies.filter(lady => lady.id !== data.id)
        existingLady = {
            ...existingLady,
            ...data
        } 
    } else {
        existingLady = data
    }

    ladies.push(existingLady)

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
                dispatch({ type: USER_STATE_CHANGE, data: snapshot.data() })
            } else {
                dispatch(logOut())
            }
        })
}

export const fetchLadies = () => (dispatch, getState) => {
    return getDocs(query(collection(db, "users"), where('establishmentId', '==', getAuth().currentUser.uid)))
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('empty')
                dispatch({ type: LADIES_STATE_CHANGE, ladies: [] })
            } else {
                const ladies = snapshot.docs
                    .map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    .sort((a, b) => b.createdDate.toDate() - a.createdDate.toDate())

                dispatch({ type: LADIES_STATE_CHANGE, ladies })
            }
        })
}

export const logOut = () => (dispatch, getState) => {
    signOut(getAuth())
    dispatch({ type: CLEAR_DATA })
}