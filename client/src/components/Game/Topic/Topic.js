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

    return (
        <div className="user-story-info-container" >
            <form className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Story Description"
                    value={storyTitle}
                    onChange={({target: {value}}) => !(isGameStarted && !areCardsOpen) ? setStoryTitle(value): null}
                    onKeyPress={e => e.key === 'Enter' ? startGame(e) : null}
                />
                {
                    !(isGameStarted && !areCardsOpen) &&
                    storyTitle &&
                    <span className="clearIcon" onClick={() => setStoryTitle("")}>X</span>
                }
            </form>
            <button className="button send-button"
                    disabled={isGameStarted && !areCardsOpen}
                    onClick={startGame}
            >
                Start Voting
            </button>
            <button className="button ml-20 open-cards-button"
                    disabled={!isGameStarted || areCardsOpen}
                    onClick={openCards}>
                Open Cards
            </button>
            <button className="button ml-20 stop-game-button"
                    disabled={!isGameStarted || areCardsOpen}
                    onClick={()=> reStartGame()}>
                Discard
            </button>
        </div>
    )
};
