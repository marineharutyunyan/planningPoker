import React from "react";
import { ADMIN_USER_TYPE } from "../../utils";

import './UserStory.css';

export default function UserStory({startGame, userType, storyNumber, setStoryNumber, storyTitle, setStoryTitle}) {
    return (
        <div className="user-story-info-container" >
            <form className="form">
                <input
                    className="input"
                    type="text"
                    placeholder="Story Name"
                    value={storyNumber}
                    onChange={({ target: { value } }) => setStoryNumber(value)}
                    onKeyPress={event => event.key === 'Enter' ? startGame(event) : null}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Story Description"
                    value={storyTitle}
                    onChange={({ target: { value } }) => setStoryTitle(value)}
                    onKeyPress={event => event.key === 'Enter' ? startGame(event) : null}
                />

                {userType === ADMIN_USER_TYPE && <button className="sendButton" onClick={e => startGame(e)}>Start</button>}
            </form>
        </div>
    )
};
