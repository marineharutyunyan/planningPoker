import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './CreateSession.css';

export default function CreateSession() {
  const [room, setRoom] = useState('');

  return (
      <div className="joinOuterContainer">
          <div className="joinInnerContainer">
            <h1 className="heading">Create Session</h1>
            <div>
              <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
            </div>
            <Link onClick={e => (!room) ? e.preventDefault() : null} to={`/game?room=${room}&name=Jacob&type=admin`}>
              <button className={'button mt-20'} type="submit">Create</button>
            </Link>
          </div>
      </div>
  );
}
