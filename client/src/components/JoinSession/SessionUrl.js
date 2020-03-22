import React from "react";
import './JoinSession.css';

export default function ShowSessionUrl({ url }) {

    return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">{url}</h1>
        <div>
            {url}
        </div>
        <button onClick={e => {} } className={'button mt-20'} type="submit">Copy</button>
      </div>
    </div>
)};
