import React, { createContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/AuthRoute';
import SinglePost from './pages/SinglePost';

function App() {
    return (
        // AuthProvider로 감싸줌으로써 Home, Login, Register 모두 context에 접근할 수 있다 
        <AuthProvider>
            <BrowserRouter>
                <div className="ui container">
                    <MenuBar />
                    <Route exact path="/" component={Home} />
                    <AuthRoute exact path="/login" component={Login} />
                    <AuthRoute exact path="/register" component={Register} />
                    <Route exact path="/posts/:postId" component={SinglePost} />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
