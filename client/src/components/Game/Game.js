import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import Cookies from 'js-cookie'

import SessionUrl from '../CreateSession/SessionUrl';
import Topic from './Topic/Topic';
//import InfoContainer from '../InfoContainer/InfoContainer';
import VotingHistory from '../VotingHistory/VotingHistory';
//import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
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
    const [selectedPoint, setSelectedPoint] = useState(false);
    const [avaragePoint, setAvaragePoint] = useState(0);
    const [haveVotingPermission, setVotingPermission] = useState(false);
    const [history, setVotingHistory] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [areCardsOpen, setOpenCards] = useState(false);
    const [points, setPoints] = useState({});
    const [storyNumber, setStoryNumber] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
    console.log('on (join and socket creation) use effect Called');
    const {name, id: room} = queryString.parse(location.search);
    const type = Cookies.get('userType') || DEFAULT_USER_TYPE;

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
            if (isGameStarted && storyNumber && storyTitle){
                socket.emit('sendStoryInfo', {
                    storyNumber,
                    storyTitle,
                    isGameStarted: true
                }, () => {});
                socket.emit('sendVotingPermission', {canVote: !areCardsOpen}, () => {});
            }
        });

        socket.on('setStoryInfo', (data) => {
            console.log('From backend -  story info  - ', data );
            setStoryNumber(data.storyNumber);
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

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    const sendEstimate = (event, number) => {
        event.preventDefault();

        if(number) {
          socket.emit('sendEstimate', number, () => setSelectedPoint(number));
        }
    };

    const openCards = () => {
        const avaragePoint = getAvaragePoint(points);
        setOpenCards(true);
        setAvaragePoint(avaragePoint);
        setVotingPermission(false);
        socket.emit('sendVotingPermission', {canVote: false}, () => {});
        socket.emit('sendVotingHistoryUpdate', {room, users, points, avaragePoint, storyNumber, storyTitle}, () => {});
    };

    const startGame = (event) => {
        event.preventDefault();
        if(storyNumber && storyTitle) {
            socket.emit('sendStoryInfo', {
                storyNumber,
                storyTitle,
                isGameStarted: true
            }, () => {});
            setOpenCards(false);
            setVotingPermission(true);
            socket.emit('sendVotingPermission', {canVote: true}, () => {});
        } else {
            alert("enter story info ");
        }
    };

    const reStartGame = (event) => {
        event.preventDefault();

        socket.emit('sendStoryInfo', {
            storyNumber: "",
            storyTitle: "",
            isGameStarted: false
        }, () => {});

        setAvaragePoint(0);
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
        <div className="outerContainer">
           {/* <div classNamne="landing-page">*/}
            {type === ADMIN_USER_TYPE ?
                (<div className="participants">
                    <SessionUrl room={room} />
                    <Topic startGame={startGame}
                               reStartGame={reStartGame}
                               isGameStarted={isGameStarted}
                               userType={type}
                               storyTitle={storyTitle}
                               storyNumber={storyNumber}
                               setStoryNumber={setStoryNumber}
                               setStoryTitle={setStoryTitle}
                    />
                    <button className="sendButton" onClick={openCards}>Open Cards</button>
                    <h4 className="avarage-point heading" >
                        Avarage point - {avaragePoint}
                    </h4>
                    {users.length ?
                        users.map((user,i) => (
                            <div key={i}>
                                <FlipCard name={user.displayName}
                                          openCards={areCardsOpen}
                                          point={points[user.name] || DEFAULT_POINT}
                                />
                            </div>))
                        :
                        <div>No User</div>}
                </div>)
                :
                type === "player" ?
                    (<div className="container">
                        <InfoBar room={room} />
                        <h3>
                            {storyNumber?
                                `Story - ${storyNumber}: ${storyTitle}`
                                :
                                "No Topic"
                            }
                        </h3>
                        {FIBONACCI_NUMBERS.map((number, i) =>
                            <div key={i}>
                                <Card cardNumber={number}
                                      haveVotingPermission={haveVotingPermission}
                                      isGameStarted={isGameStarted}
                                      selectedPoint={selectedPoint}
                                      sendEstimate={sendEstimate}
                                />
                            </div>)
                        }
                    </div>)
                : null
            }
            {/*<InfoContainer users={users} points={points}/>*/}
            <VotingHistory history={history}/>
        </div>
     /*   </div>*/
    );
};

export default Game;
