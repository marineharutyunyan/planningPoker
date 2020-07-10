import React, { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from "react-emoji";
import {DEFAULT_USER_TYPE, ADMIN_USER_TYPE} from "../utils";

import './VotingHistory.css';

const VotingHistory = ({ history, userType, deleteEstimation, isBeingReEstimated, reEstimate, reStartGame }) => {

    const [itemId, setItemId] = useState(null);

    const onReEstimate = (id, title) => {
        setItemId(id);
        reEstimate(id, title);
    };

    const onCancleReEstimate = () => {
        setItemId(null);
        reStartGame(' ');
    };

    useEffect(() => {
        !isBeingReEstimated && setItemId(null);
    }, [isBeingReEstimated]);

    return (
        <ScrollToBottom className="historyContainer fade-background">
            <div className="activeContainer">
                <h2 className="title">Estimation History</h2>
                {history && history.length ?
                    history.map(stage => (
                        <div className={`"mb-40" ${itemId === stage.id ? 'highlight': ''}`} key={stage.id}>
                            <div className="story-title">{stage.storyTitle}</div>
                            {
                                userType === ADMIN_USER_TYPE &&
                                <div>
                                    {
                                        !isBeingReEstimated &&
                                        <>
                                            <button className="replay"
                                                    onClick={() => onReEstimate(stage.id, stage.storyTitle)}
                                            />
                                            <button className="delete" onClick={() => deleteEstimation(stage.id)}/>
                                        </>
                                    }
                                    {
                                        isBeingReEstimated &&
                                        <button className="cancle" onClick={() => onCancleReEstimate()}/>
                                    }

                                </div>
                            }
                            <div className="inline-block">Avarage fibonacci number: {stage.avarageConvertedToFib}</div>
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
};

export default VotingHistory;