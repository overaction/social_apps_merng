import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../context/auth';

// Component, 그리고 rest
// rest는 component를 제외한 나머지, 즉 exact path="/login" 를 말한다

function AuthRoute({ component: Component, ...rest}) {
    const contexts = useContext(AuthContext);
    console.log(rest);
    return (
        <Route 
            // render 를 통해 context가 저장되어 있다면 무조건 홈으로 가도록 한다
            // https://mingcoder.me/2019/12/04/Programming/React/react-router-component-vs-render/
            render={props => (
                contexts.user ? <Redirect to="/"/> : <Component {...props} />
                )
            }
        />
    )
};

export default AuthRoute;