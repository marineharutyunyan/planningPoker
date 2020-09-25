import React from "react";
import ReactEmoji from "react-emoji";

import './FlipCard.css';

export default function FlipCard({name, point, openCards}) {
    const className = openCards ?
        'open'
        :
        point !== '?' ? 'hasPoint' : '';
    return (
        <div className={`flip-card ${className}`} onClick={(e) =>{}} >
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h2>{ReactEmoji.emojify(name)}</h2>
                </div>
                <div className="flip-card-back">
                    <h1>{point}</h1>
                    <p>{null}</p>
                </div>
            </div>
        </div>
    )
};
