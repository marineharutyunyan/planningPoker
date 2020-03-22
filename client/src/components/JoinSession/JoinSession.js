import React, { useState } from 'react';

import './JoinSession.css';
import SessionUrl from './SessionUrl';

export default function CreateSession() {
  const [room, setRoom] = useState('');
    const [url, setUrl] = useState('');
    const windowUrl = window.location.href;

  return (
    url ?
    <SessionUrl url = {url} room = {room}/>
      :
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Create Session</h1>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
      <button onClick={e => (!room) ?
              e.preventDefault() :
              setUrl(`${windowUrl}join?room=${room}`)
          } className={'button mt-20'} type="submit">Create</button>

      </div>
    </div>
  );
}
