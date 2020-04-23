import React from "react";
import { ADMIN_USER_TYPE } from "../../utils";

import './Topic.css';

export default function Topic({
     startGame,
     reStartGame,
     isGameStarted,
     userType,
     storyNumber,
     setStoryNumber,
     storyTitle,
     setStoryTitle,
     openCards,
     areCardsOpen

}) {
    const start = (e) => {
        e.preventDefault();
        if (isGameStarted) {
            reStartGame(e);
        } else {
            startGame(e);
        }
    };

    return (
        <div className="user-story-info-container" >
            <form className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Story Name"
                    value={storyNumber}
                    onChange={({ target: { value } }) => setStoryNumber(value)}
                    onKeyPress={event => event.key === 'Enter' ? start(event) : null}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Story Description"
                    value={storyTitle}
                    onChange={({ target: { value } }) => setStoryTitle(value)}
                    onKeyPress={event => event.key === 'Enter' ? start(event) : null}
                />

                {
                    userType === ADMIN_USER_TYPE && <button className="button send-button" onClick={start}>
                        {isGameStarted ? 'Restart' : 'Start Voting'}
                        </button>

                }
            </form>

            {
                userType === ADMIN_USER_TYPE && <button className="button ml-20 open-cards-button"
                                                        onClick={openCards}
                                                        disabled={!isGameStarted || areCardsOpen}>
                    Open Cards
                </button>
            }
        </div>
    )
};
