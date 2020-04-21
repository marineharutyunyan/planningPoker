import React from 'react';

import Game from './components/Game/Game';
import Join from './components/Join/Join';
import CreateSession from './components/CreateSession/CreateSession';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={CreateSession} />
            <Route path="/join" component={Join} />
            <Route path="/game" component={Game} />
        </Router>
    );
};

export default App;
