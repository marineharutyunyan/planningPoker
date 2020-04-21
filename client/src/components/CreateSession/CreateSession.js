import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import { ADMIN_USER_TYPE, getUnicID } from "../utils";

import './CreateSession.css';

export default function CreateSession() {
    const [name, setName] = useState('');
    const unicId = getUnicID();

    const onCreateSession = (e) => {
        if(!name) {
            e.preventDefault();
        } else {
            Cookies.set('userType', ADMIN_USER_TYPE);
        }
    };

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Welcome to Planning Poker</h1>
                <div>
                    <input placeholder="Name"
                         className="joinInput mt-20"
                         type="text"
                         onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <Link onClick={onCreateSession} to={`/game?id=${unicId}&name=${name}`}>
                    <button className={'button mt-20'} type="submit">Start</button>
                </Link>
            </div>
        </div>
    );
}
