import React from "react";

import './Card.css';

export default function Card(
    {cardNumber,
     sendEstimate,
     selectedPoint,
     isGameStarted,
     haveVotingPermission
    })
{
    let selectedClassName = selectedPoint && selectedPoint === cardNumber ? "selected" : "";
    selectedClassName = isGameStarted ? selectedClassName : "";
    const onCardClick = (e) => {
        e.preventDefault();
        if (isGameStarted && haveVotingPermission) {
            sendEstimate(e, cardNumber);
        }
    };

    return (

        <div className={`card ${selectedClassName}`} onClick={onCardClick}>
            <div className="card-inner">
                    <h1>{cardNumber}</h1>
            </div>
        </div>
    )
};
