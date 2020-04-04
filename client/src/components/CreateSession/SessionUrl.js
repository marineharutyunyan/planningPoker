import React from "react";
import './CreateSession.css';

export default function ShowSessionUrl({ room }) {
    const url = `http://localhost:3000/join?room=${room}`;

    return (
      <div className="joinInnerContainer">
        <h1 className="heading" id ="heading" >{url}</h1>
        <div>
            {url}
        </div>
        <button onClick={e => {}} className={'button mt-20'} type="submit">Copy</button>
      </div>
)};
