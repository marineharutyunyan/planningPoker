import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from "react-emoji";
import {DEFAULT_USER_TYPE, ADMIN_USER_TYPE} from "../utils";

import './VotingHistory.css';

const VotingHistory = ({ history, userType, deleteEstimation, reEstimate }) => (

    <ScrollToBottom className="historyContainer fade-background">
        <div className="activeContainer">
            <h2 className="title" >Estimation History</h2>
            {history && history.length ?
                history.map(stage => (
                    <div className="mb-40" key={stage.id}>
                        <div>{stage.storyTitle}: {stage.id}</div>
                        {
                            userType === ADMIN_USER_TYPE &&
                            <div>
                                <button onClick={() => reEstimate(stage.id, stage.storyTitle)}>Re-Estimate</button>
                                <button onClick={() => deleteEstimation(stage.id)}>Delete</button>
                            </div>
                        }
                        <div>Avarage fibonacci number: {stage.avarageConvertedToFib}</div>
                        <div>Avarage number: {stage.avaragePoint}</div>
                        <ul>
                            {
                                stage.users.map(({displayName, type, point}, i) => (
                                    type === DEFAULT_USER_TYPE ?
                                        <li key={i}>{ReactEmoji.emojify(displayName)}{`: ${point || " ?" }`}</li>
                                        :
                                        null
                                ))
                            }
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