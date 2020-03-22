import React from 'react';

import Game from './components/Game/Game';
import Join from './components/Join/Join';
import JoinSession from './components/JoinSession/JoinSession';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Route path="/" exact component={JoinSession} />
            <Route path="/join" component={Join} />
            <Route path="/game" component={Game} />
        </Router>
    );
};

export default App;
