import React from 'react';
import closeIcon from '../../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({  room, storyTitle }) => {

    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <h3>{storyTitle ? storyTitle : "No Topic"}</h3>
            </div>
            <div className="rightInnerContainer">
                <a href={`/join?id=${room}`}><img src={closeIcon} alt="close icon"/></a>
            </div>
        </div>
    );
};

export default InfoBar;