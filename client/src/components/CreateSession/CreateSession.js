import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import { ADMIN_USER_TYPE, getUnicID } from "../utils";

import './CreateSession.css';

export default function CreateSession({ location }) {
    const buttonRef = useRef(null);
    const [name, setName] = useState('');
    const unicId = getUnicID();

    const onCreateSession = (e) => {
        if(name && name.trim().length) {
            Cookies.set('userType', ADMIN_USER_TYPE);
            Cookies.set('id', unicId);
        } else {
            e.preventDefault();
        }
    };

    return (
        <div className="joinOuterContainer">
            {
                 !location.state &&
                 <Link to={{ pathname: "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=UjZJ3xXvXyrftnikidpY5O2VfmRjtpwA&scope=read%3Ajira-user%20read%3Ajira-work%20write%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&state=$marine&response_type=code&prompt=consent" }} target="_blank" className="connectJira">
                    Connect with
                    <img className="jiraImg"
                         src="https://helpdesk.bottlerocketstudios.com/images/atlassian-jira-logo-large.png"
                         alt="Jira"
                    />
                </Link>
            }
            <div className="joinInnerContainer">
                <h1 className="heading">Welcome to Planning Poker</h1>
                <div>
                    <input autoFocus
                           type="text"
                           placeholder="Name"
                           className="joinInput mt-20"
                           onChange={(e) => setName(e.target.value)}
                           onKeyDown={e => (e.key === 'Enter' && name) && buttonRef.current.click()}
                    />
                </div>
                <Link onClick={onCreateSession} to={{
                            pathname: `/game`,
                            search: `?id=${unicId}&name=${name}`,
                            state: location.state
                        }}
                >
                    <button ref={buttonRef} className={'button mt-20'} type="submit">Start</button>
                </Link>
            </div>
        </div>
    );
}
