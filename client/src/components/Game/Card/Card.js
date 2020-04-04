import React from "react";

import './Card.css';

export default function Card({cardNumber, sendEstimate, selectedPoint}) {
    const selectedClassName = selectedPoint && selectedPoint === cardNumber ? "card-back selected" : "card-back";
    return (

        <div className="card" onClick={(e) => sendEstimate(e,cardNumber)}>
            <div className="card-inner">
                <div className={selectedClassName}>
                    <h1>{cardNumber}</h1>
                </div>
            </div>
        </div>
    )
};
