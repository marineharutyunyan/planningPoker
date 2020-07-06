import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import Cookies from 'js-cookie'

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
    ENDPOINT,
    getAvaragePoint
} from "../utils";

let socket;

const Game = ({ location }) => {

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [points, setPoints] = useState({});
    const [history, setVotingHistory] = useState([]);
    const [storyTitle, setStoryTitle] = useState('');
    const [areCardsOpen, setOpenCards] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [haveVotingPermission, setVotingPermission] = useState(false);

    useEffect(() => {
        console.log('on (join and socket creation) use effect Called');

        const {name, id: room} = queryString.parse(location.search);
        const cookieId = Cookies.get('id');
        const type = cookieId && cookieId === room ?  Cookies.get('userType') : DEFAULT_USER_TYPE;

        socket = io(ENDPOINT);

        setRoom(room);
        setName(name);
        setType(type);
        points[name] = DEFAULT_POINT;
        setPoints(points);

        socket.emit('join', { name, type, room }, (error) => {
            if(error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location.search]);


    useEffect(() => {

        console.log("big UseEfect called");

        socket.on('setEstimate', (data) => {
            console.log('From backend -  estimate  - ', data );
            points[data.user] = data.point;
            setPoints({...points});
            if (users.length>1 && Object.keys(points).length === users.length) {
                openCards();
            }
        });

        socket.on('userJoined', (data) => {
            console.log('From backend -  userJoined  - ', data );
            if (isGameStarted && storyTitle){
                socket.emit('sendStoryInfo', {
                    storyTitle,
                    isGameStarted: true
                }, () => {});
                socket.emit('sendVotingPermission', {canVote: !areCardsOpen}, () => {});
            }
        });

        socket.on('setStoryInfo', (data) => {
            console.log('From backend -  story info  - ', data );
            setStoryTitle(data.storyTitle);
            setIsGameStarted(data.isGameStarted);
            if (!data.isGameStarted){
                setSelectedPoint(false);
            }
        });

        socket.on('setVotingPermission', (data) => {
            console.log('From backend -  voting permission  - ', data );
            setVotingPermission(data.canVote);
        });

        socket.on('setVotingHistory', (data) => {
            console.log('From backend -  voting History  - ', data );
            setVotingHistory(data.history);
        });

        socket.on('message', (data) => {
            console.log('From backend -  message  - ', data)
            // setMessages([...messages, data.point ]);
            //  points[data.user] = data.point;
            // setPoints(points);
        });

        socket.on('roomData', ({users}) => {
            setUsers(users);
        });

        socket.on('removePoint', ({user}) => {
            if(points[user]){
                const {[user]: removedPoint, ...updatedPoints} = points;
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
        const {avarage: avaragePoint, avarageConvertedToFib} = getAvaragePoint(points);
        setOpenCards(true);
        setVotingPermission(false);
        socket.emit('sendVotingPermission', {canVote: false}, () => {});
        socket.emit('sendVotingHistoryUpdate', {room, users, points, avaragePoint, avarageConvertedToFib, storyTitle}, () => {});
    };

    const startGame = (event) => {
        event.preventDefault();
        reStartGame(event);
        if(storyTitle) {
            socket.emit('sendStoryInfo', {
                storyTitle,
                isGameStarted: true
            }, () => {});
            setVotingPermission(true);
            socket.emit('sendVotingPermission', {canVote: true}, () => {});
        } else {
            alert("enter story information ");
        }
    };

    const reStartGame = (event) => {
        event.preventDefault();

        socket.emit('sendStoryInfo', {
            storyTitle,
            isGameStarted: false
        }, () => {});

        setVotingPermission(false);
        socket.emit('sendVotingPermission', {canVote: false}, () => {});
        setOpenCards(false);
        setPoints({[name]: '?'});
    };

    console.log("trying render");
    console.log("------------------------");
    console.log("type - ", type);
    console.log("room - ", room);
    console.log("users - ", users);
    console.log("points - ", points);
    console.log("haveVotingPermission - ", haveVotingPermission);
    console.log("History - ", history);
    console.log("------------------------");
    return (
        type === ADMIN_USER_TYPE ?
            <div>
                <div className="topicContainer">
                    <SessionUrl room={room} />
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
                    <div className="cardsContainer">
                        {users.length && users.length>1 ?
                            users.map((user,i) => (
                                user.type === DEFAULT_USER_TYPE ?
                                    <div key={i}>
                                        <FlipCard name={user.displayName}
                                                  openCards={areCardsOpen}
                                                  point={points[user.name] || DEFAULT_POINT}
                                        />
                                    </div>
                                    :
                                    null
                            ))
                            :
                            <div>No User</div>}
                    </div>
                    <VotingHistory history={history}/>
                </div>
            </div>
            :
            type === "player" ?

                <div>
                    <InfoBar storyTitle={storyTitle} room={room} />
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
                        <VotingHistory history={history}/>
                    </div>
                </div>
            :
            null
    );
};

export default Game;
