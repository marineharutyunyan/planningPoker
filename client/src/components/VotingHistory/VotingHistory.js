import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from "react-emoji";

import './VotingHistory.css';

const VotingHistory = ({ history }) => (

        <ScrollToBottom className="historyContainer fade-background">
            <div className="activeContainer">
                <h2>Estimation History</h2>
                {history && history.length ?
                    history.map( stage => (
                        <div className="mb-20">
                            <div>{`${stage.storyNumber} ${stage.storyTitle}`}</div>
                            <div>Avarage Point: {stage.avaragePoint}</div>
                            <ul>
                                {stage.users.map(({displayName, point}) => (
                                    <li>{ReactEmoji.emojify(displayName)}{`: ${point || " ?" }`}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                    :
                    <div>No history yet</div>
                }
            </div>
        </ScrollToBottom>
);

export default VotingHistory;