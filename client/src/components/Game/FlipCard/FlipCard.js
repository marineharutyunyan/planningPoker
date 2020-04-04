import React from "react";

import './FlipCard.css';

export default function FlipCard({name, point}) {
    return (
        <div className="flip-card" onClick={(e) =>{}} >
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h1>{name}</h1>
                </div>
                <div className="flip-card-back">
                    <h1>{point}</h1>
                    <p>{null}</p>
                </div>
            </div>
        </div>
    )
};
