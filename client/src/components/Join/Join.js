import React, { useState } from 'react';
import { Link } from "react-router-dom";
import queryString from 'query-string';

import './Join.css';

export default function SignIn({ location }) {
  const [name, setName] = useState('');
  const { id: room } = queryString.parse(location.search);

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/game?id=${room}&name=${name}`}>
          <button className={'button mt-20'} type="submit">Join</button>
        </Link>
      </div>
    </div>
  );
}
