import React from "react";

import './Card.css';

export default function Card({cardNumber, sendEstimate, selectedPoint, isGameStarted}) {
    const selectedClassName = selectedPoint && selectedPoint === cardNumber ? "card-back selected" : "card-back";
    const onCardClick = (e) => {
        e.preventDefault();
        isGameStarted && sendEstimate(e,cardNumber)
    };

    return (

        <div className="card" onClick={onCardClick}>
            <div className="card-inner">
                <div className={selectedClassName}>
                    <h1>{cardNumber}</h1>
                </div>
            </div>
        </div>
    )
};
