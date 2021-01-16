import React, { createContext, useReducer } from 'react'

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

const initialState = {
    user: null
}

function AuthProvider({children}) {
    console.log(children)
    const [state, dispatch] = useReducer(authReducer,initialState);

    function login(userdata) {
        dispatch({
            type: 'LOGIN',
            payload: userdata
        })
    }

    function logout() {
        dispatch({type: 'LOGOUT'})
    }

    return (
        <AuthContext.Provider value={{ user: state.user, login:login, logout:logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}