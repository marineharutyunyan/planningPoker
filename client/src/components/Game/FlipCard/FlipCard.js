import React from "react";

import './FlipCard.css';


export default function FlipCard({ setEstimate, sendEstimate, cardNumber, point }) {
    return (
        <div className="flip-card"
             onClick={(e) =>{
            setEstimate(cardNumber);
            sendEstimate(e,cardNumber);
            }}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img className="img" src={"img_avatar.png"} alt={"Avatar"} />
            </div>
            <div className="flip-card-back">
              <h1>John Doe</h1>
              <p>{cardNumber}</p>
              <p>{point}</p>
            </div>
          </div>
        </div>
    )
};
