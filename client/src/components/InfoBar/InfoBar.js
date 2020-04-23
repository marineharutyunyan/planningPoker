import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({  room, storyNumber, storyTitle }) => {

    return (
        <div className="infoBar">
            <div className="leftInnerContainer">
                <img className="onlineIcon" src={onlineIcon} alt="online icon"/>
                <h3>{storyNumber || storyTitle ?
                    `${storyNumber} ${storyTitle}`
                    :
                    "No Topic"
                }</h3>
            </div>
            <div className="rightInnerContainer">
                <a href={`/join?id=${room}`}><img src={closeIcon} alt="close icon"/></a>
            </div>
        </div>
    );
};

export default InfoBar;