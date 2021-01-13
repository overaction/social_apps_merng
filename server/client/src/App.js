import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';

function App() {
  return (
      <BrowserRouter>
          <div className="ui container">
              <MenuBar />
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
          </div>
      </BrowserRouter>
  );
}

export default App;
