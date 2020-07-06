import React from "react";
import './Topic.css';

export default function Topic({
     startGame,
     reStartGame,
     isGameStarted,
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
                    placeholder="Story Description"
                    value={storyTitle}
                    onChange={({ target: { value } }) => setStoryTitle(value)}
                    onKeyPress={e => e.key === 'Enter' ? start(e) : null}
                />
            </form>
            <button className="button send-button" onClick={start}>
                {isGameStarted ? 'Restart' : 'Start Voting'}
            </button>
            <button className="button ml-20 open-cards-button"
                    disabled={!isGameStarted || areCardsOpen}
                    onClick={openCards}>
                Open Cards
            </button>
        </div>
    )
};
