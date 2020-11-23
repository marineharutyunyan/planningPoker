import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import Cookies from 'js-cookie'
import { Redirect } from "react-router-dom";

import SessionUrl from '../CreateSession/SessionUrl';
import Topic from './Topic/Topic';
import VotingHistory from '../VotingHistory/VotingHistory';
import InfoBar from './InfoBar/InfoBar';
import FlipCard from './FlipCard/FlipCard.js';
import Card from './Card/Card.js';

import './Game.css';

import {
    FIBONACCI_NUMBERS,
    DEFAULT_USER_TYPE,
    ADMIN_USER_TYPE,
    DEFAULT_POINT,
    NO_POINT,
    ENDPOINT,
    getUnicID,
    getAveragePoint
} from "../utils";

let socket;

const Game = ({ location }) => {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [points, setPoints] = useState({});
    const [stageId, setStageId] = useState('');
    const [hasError, setHasError] = useState(false);
    const [history, setVotingHistory] = useState([]);
    const [storyTitle, setStoryTitle] = useState('');
    const [areCardsOpen, setOpenCards] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isBeingReEstimated, setIsBeingReEstimated] = useState(false);
    const [highlightLastScore, setHighlightLastScore] = useState(false);
    const [haveVotingPermission, setVotingPermission] = useState(false);

    useEffect(() => {
//        console.log('on (join and socket creation) use effect Called');

        const {name, id: room} = queryString.parse(location.search);
        const cookieId = Cookies.get('id');
        const type = cookieId && cookieId === room ?  Cookies.get('userType') : DEFAULT_USER_TYPE;

        socket = io(ENDPOINT);

        setRoom(room);
        setName(name);
        setType(type);
        setHighlightLastScore(false);

        socket.emit('join', { name, type, room }, (error, id) => {
            if(error) {
                setType(Cookies.get('userType') || type);
                setHasError(true);
                socket.emit('disconnect');
                socket.off();
                alert(error);
            } else {
                if (id) {
                    setId(id);
                    points[id] = DEFAULT_POINT;
                    setPoints(points);
                }
                if (type === ADMIN_USER_TYPE && !error) {
                    reStartGame();
                }

            }

        });
    }, [ENDPOINT, location.search]);


    useEffect(() => {

//        console.log("USE EFFECT called");

        socket.on('setEstimate', (data) => {
//            console.log('From backend -  estimate  - ', data );
            points[data.id] = data.point;
            setPoints({...points});
            if (users.length>1 && Object.keys(points).length === users.length) {
                openCards();
            }
        });

        socket.on('userJoined', (data) => {
//            console.log('From backend -  userJoined  - ', data );
            if (isGameStarted && storyTitle && !hasError){
                socket.emit('sendStoryInfo', {
                    storyTitle,
                    isGameStarted: true
                }, () => {});
                socket.emit('sendVotingPermission', {canVote: !areCardsOpen}, () => {});
            }
        });

        socket.on('setStoryInfo', (data) => {
//            console.log('From backend -  story info  - ', data );
            setStoryTitle(data.storyTitle);
            setIsGameStarted(data.isGameStarted);
            if (!data.isGameStarted){
                setSelectedPoint(false);
            }
        });

        socket.on('setVotingPermission', (data) => {
//            console.log('From backend -  voting permission  - ', data );
            setVotingPermission(data.canVote);
        });

        socket.on('setVotingHistory', (data) => {
//            console.log('From backend -  voting History  - ', data );
            setVotingHistory(data.history);
        });

        socket.on('message', (data) => {
//            console.log('From backend -  message  - ', data)
            // setMessages([...messages, data.point ]);
            //  points[data.user] = data.point;
            // setPoints(points);
        });

        socket.on('roomData', ({users}) => {
            setUsers(users);
        });

        socket.on('removePoint', ({id}) => {
            if (points[id]) {
                const {[id]: removedPoint, ...updatedPoints} = points;
                setPoints(updatedPoints);
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    });

    const sendEstimate = (event, number) => {
        event.preventDefault();

        if(number) {
          socket.emit('sendEstimate', number, () => setSelectedPoint(number));
        }
    };

    const openCards = () => {
        const {average: averagePoint, averageConvertedToFib} = getAveragePoint(points);
        setOpenCards(true);
        setVotingPermission(false);
        socket.emit('sendVotingPermission', {canVote: false}, () => {});
        socket.emit(
                'sendVotingHistoryUpdate',
                {
                    room,
                    users,
                    points,
                    averagePoint,
                    averageConvertedToFib,
                    storyTitle,
                    stageId
                },
                () => {
                    setIsBeingReEstimated(false);
                    setHighlightLastScore(true);
                }
            );
    };

    const startGame = (event) => {
        event.preventDefault();
        !isBeingReEstimated && reStartGame();
        if(storyTitle && storyTitle.trim().length) {
            socket.emit('sendStoryInfo', {
                storyTitle,
                isGameStarted: true
            }, () => {});
            setVotingPermission(true);
            socket.emit('sendVotingPermission', {canVote: true}, () => {});
            !isBeingReEstimated && setStageId(getUnicID());
        } else {
            alert("Please enter story information");
        }
    };

    const reStartGame = (titleFromHistory) => {
        if (!hasError) {
            socket.emit('sendStoryInfo', {
                storyTitle: titleFromHistory || storyTitle ,
                isGameStarted: false
            }, () => {});

            setVotingPermission(false);
            socket.emit('sendVotingPermission', {canVote: false}, () => {});
            setOpenCards(false);
            setPoints({[id]: '?'});
            setStageId('');
            setIsBeingReEstimated(false);
        }
    };

    const deleteEstimation = (id) => {
        socket.emit('deleteEstimationFromHistory', {room, id}, () => {});
    };

    const reEstimate = (id, title) => {
        setStoryTitle(title);
        reStartGame(title);
        setStageId(id);
        setIsBeingReEstimated(true);
    };

/*
    console.log("RENDERING");
    console.log("------------------------");
    console.log("type - ", type);
    console.log("room - ", room);
    console.log("users - ", users);
    console.log("points - ", points);
    console.log("haveVotingPermission - ", haveVotingPermission);
    console.log("History - ", history);
    console.log("------------------------");
 */
    return (
        type === ADMIN_USER_TYPE ?
            hasError ?
                <Redirect to={'/'} />
                :
                <>
                <div className="sectionOne">
                    <div className="topicContainer">
                        <Topic openCards={openCards}
                               startGame={startGame}
                               storyTitle={storyTitle}
                               reStartGame={reStartGame}
                               areCardsOpen={areCardsOpen}
                               setStoryTitle={setStoryTitle}
                               isGameStarted={isGameStarted}
                        />
                    </div>
                    <div className="content">
                        <div className="participants">
                            {users.length && users.length>1 ?
                                users.map((user,i) => (
                                    user.type === DEFAULT_USER_TYPE ?
                                        <div key={i}>
                                            <FlipCard name={user.displayName}
                                                      openCards={areCardsOpen}
                                                      point={points[user.id] || NO_POINT}
                                            />
                                        </div>
                                        :
                                        null
                                ))
                                :
                                <div>No User</div>}
                        </div>
                    </div>
                </div>
                <div className="sectionTwo">
                    <h2 className="title">Estimation History</h2>
                    <VotingHistory history={history}
                                   userType={type}
                                   reEstimate={reEstimate}
                                   reStartGame={reStartGame}
                                   deleteEstimation={deleteEstimation}
                                   highlightLastScore={highlightLastScore}
                                   isBeingReEstimated={isBeingReEstimated}
                    />
                    <h2 className="title mt-40">Invite teammates</h2>
                    <SessionUrl room={room} />
                </div>
                </>
        :
        type === DEFAULT_USER_TYPE ?
            hasError ?
                <Redirect to={`/join?id=${room}`} />
                :
                <>
                <InfoBar storyTitle={storyTitle} room={room} />
                <div className="sectionOne">
                    <div className="content">
                        <div className="cardsContainer">
                            {FIBONACCI_NUMBERS.map((number, i) =>
                                <div key={i}>
                                    <Card name={name}
                                          cardNumber={number}
                                          sendEstimate={sendEstimate}
                                          isGameStarted={isGameStarted}
                                          selectedPoint={selectedPoint}
                                          haveVotingPermission={haveVotingPermission}
                                    />
                                </div>)
                            }
                        </div>
                    </div>
                </div>
                <div className="sectionTwo">
                    <h2 className="title">Estimation History</h2>
                    <VotingHistory history={history}
                                   userType={type}
                                   reEstimate={reEstimate}
                                   reStartGame={reStartGame}
                                   deleteEstimation={deleteEstimation}
                                   highlightLastScore={highlightLastScore}
                                   isBeingReEstimated={isBeingReEstimated}
                    />
                </div>
                </>
        :
        null
    );
};

export default Game;
