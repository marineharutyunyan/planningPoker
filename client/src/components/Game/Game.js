import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import SessionUrl from '../CreateSession/SessionUrl';
import UserStory from './UserStory/UserStory';
import TextContainer from '../TextContainer/TextContainer';
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
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [openCards, setOpenCards] = useState(false);
    const [points, setPoints] = useState({});
    const [storyNumber, setStoryNumber] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
    console.log('on (join and socket creation) use effect Called');
    const {
        name,
        room,
        type = DEFAULT_USER_TYPE
    } = queryString.parse(location.search);

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

 /* useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages]);*/
    useEffect(() => {
        console.log('on (message) use effect Called');
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

    useEffect(() => {
        console.log('on (setEstimate) use effect Called');
        socket.on('setEstimate', (data) => {
            console.log('From backend -  estimate  - ', data );
            points[data.user] = data.point;
            setPoints({...points});
            if (users.length>1 && Object.keys(points).length === users.length) {
                setOpenCards(true);
                setAvaragePoint(getAvaragePoint(points));
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    });

    useEffect(() => {
        console.log('on (userJoined) use effect Called');
        socket.on('userJoined', (data) => {
            console.log('From backend -  userJoined  - ', data );
            if (isGameStarted && storyNumber && storyTitle){
                socket.emit('sendStoryInfo', {
                    storyNumber,
                    storyTitle,
                    isGameStarted: true
                }, () => {});
            }
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    });


    useEffect(() => {
        console.log('on (setStoryInfo) use effect Called');
        socket.on('setStoryInfo', (data) => {
            console.log('From backend -  story info  - ', data );
            setStoryNumber(data.storyNumber);
            setStoryTitle(data.storyTitle);
            setIsGameStarted(data.isGameStarted);
            if (!data.isGameStarted){
                setSelectedPoint(false);
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
    const startGame = (event) => {
        event.preventDefault();
        if(storyNumber && storyTitle) {
            socket.emit('sendStoryInfo', {
                storyNumber,
                storyTitle,
                isGameStarted: true
            }, () => {});
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
        setPoints({admin: '?'});
    };

    console.log("trying render");
    console.log("------------------------");
    console.log("type - ", type);
    console.log("room - ", room);
    console.log("users - ", users);
    console.log("points - ", points);
    console.log("------------------------");
    return (
        <div className="outerContainer">
            {type === ADMIN_USER_TYPE ?
                (<div className="participants">
                    <SessionUrl room={room} />
                    <UserStory startGame={startGame}
                               reStartGame={reStartGame}
                               isGameStarted={isGameStarted}
                               userType={type}
                               storyTitle={storyTitle}
                               storyNumber={storyNumber}
                               setStoryNumber={setStoryNumber}
                               setStoryTitle={setStoryTitle}
                    />
                    <h4 className="avarage-point heading" >
                        Avarage point - {avaragePoint}
                    </h4>
                    {users.length ?
                        users.map((user,i) => (
                            <div key={i}>
                                <FlipCard name={user.name}
                                          openCards={openCards}
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
                                      isGameStarted={isGameStarted}
                                      selectedPoint={selectedPoint}
                                      sendEstimate={sendEstimate}
                                />
                            </div>)
                        }
                    </div>)
                : null
            }
            <TextContainer users={users}/>
        </div>
    );
};

export default Game;
