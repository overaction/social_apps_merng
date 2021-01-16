import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
}

if(localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    console.log(decodedToken)
    if(decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userdata) => {},
    logout: () => {},
});

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ... state,
                user: null,
            }
        default:
            return state;
    }
}

function AuthProvider({children}) {
    console.log(children)
    const [state, dispatch] = useReducer(authReducer,initialState);

    function login(userdata) {
        localStorage.setItem('jwtToken',userdata.token)
        dispatch({
            type: 'LOGIN',
            payload: userdata
        })
    }

    function logout() {
        localStorage.clear();
        dispatch({type: 'LOGOUT'})
    }

    return (
        <AuthContext.Provider value={{ user: state.user, login:login, logout:logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}