import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import { ADMIN_USER_TYPE, getUnicID } from "../utils";

import './CreateSession.css';

export default function CreateSession() {
    const [room, setRoom] = useState('');
    const unicId = getUnicID();

    const onCreateSession = (e) => {
        if(!room) {
            e.preventDefault();
        } else {
            Cookies.set('userType', ADMIN_USER_TYPE);
        }
    };

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Create Session</h1>
                <div>
                    <input placeholder="Session Name"
                         className="joinInput mt-20"
                         type="text"
                         onChange={(event) => setRoom(event.target.value)}
                    />
                </div>
                <Link onClick={onCreateSession} to={`/game?id=${unicId}&name=admin`}>
                    <button className={'button mt-20'} type="submit">Create</button>
                </Link>
            </div>
        </div>
    );
}
