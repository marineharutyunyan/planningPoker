import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from "react-emoji";
import {DEFAULT_USER_TYPE} from "../utils";

import './VotingHistory.css';

const VotingHistory = ({ history }) => (

        <ScrollToBottom className="historyContainer fade-background">

            <div className="activeContainer">
                <h2 className="title" >Estimation History</h2>
                {history && history.length ?
                    history.map( stage => (
                        <div className="mb-40">
                            <div>{`${stage.storyNumber} ${stage.storyTitle}`}</div>
                            <div>Avarage fibonacci number: {stage.avaragePoint}</div>
                            <ul>
                                {stage.users.map(({displayName, type,point}) => (
                                    type === DEFAULT_USER_TYPE ?
                                        <li>{ReactEmoji.emojify(displayName)}{`: ${point || " ?" }`}</li>
                                        :
                                        null
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