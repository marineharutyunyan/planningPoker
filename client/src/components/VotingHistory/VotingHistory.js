import React, { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from "react-emoji";
import {DEFAULT_USER_TYPE, ADMIN_USER_TYPE} from "../utils";

import './VotingHistory.css';

const VotingHistory = (
    {
        history,
        userType,
        deleteEstimation,
        isBeingReEstimated,
        highlightLastScore,
        reEstimate,
        reStartGame
}) => {

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
        <ScrollToBottom mode={"top"} className="historyContainer fade-background">
            <div className={`activeContainer ${highlightLastScore ? 'highlight-last-score' : '' }`}>
                {history && history.length ?
                    history.map(stage => (
                        <div className={itemId === stage.id ? 'highlight': ''} key={stage.id}>
                            <div className="topWrapper">
                                <div className="story-title">{stage.storyTitle}</div>
                                {
                                    userType === ADMIN_USER_TYPE &&
                                    <div className="actionsWrapper">
                                        {
                                            !isBeingReEstimated &&
                                            <>
                                            <span className="material-icons replay"
                                                  title={"Re-estimate"}
                                                  onClick={() => onReEstimate(stage.id, stage.storyTitle)}
                                            >
                                                replay
                                            </span>
                                                <span className="material-icons delete"
                                                      title={"Delete"}
                                                      onClick={() => deleteEstimation(stage.id)}
                                                >
                                                delete
                                            </span>
                                            </>
                                        }
                                        {
                                            isBeingReEstimated && itemId === stage.id &&
                                            <span className="material-icons cancle"
                                                  onClick={() => onCancleReEstimate()}
                                            >
                                                close
                                            </span>
                                        }

                                    </div>
                                }
                            </div>
                            <div className="avarageNumber inline-block">Avarage fibonacci number: {stage.avarageConvertedToFib}</div>
                            <div className="avarageNumber">Avarage number: {stage.avaragePoint}</div>
                            <ul className="participantsVotes">
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