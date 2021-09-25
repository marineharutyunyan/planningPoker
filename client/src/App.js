import React from 'react';

import Game from './components/Game/Game';
import Join from './components/Join/Join';
import Authorization from './components/Authorization/Authorization';
import AuthorizationDemo from './components/Authorization/AuthorizationDemo';
import CreateSession from './components/CreateSession/CreateSession';
import './App.css';
import { NorthstarProvider } from '@northstar/core';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
    return (
        <NorthstarProvider>
            <Router>
                <Route path="/" exact component={CreateSession} />
                <Route path="/join" component={Join} />
                <Route path="/game" component={Game} />
                <Route path="/callback" component={Authorization} />
                <Route path="/authorization" component={AuthorizationDemo} />
            </Router>
        </NorthstarProvider>
    );
};

export default App;
