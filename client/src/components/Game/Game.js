import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import SessionUrl from '../CreateSession/SessionUrl';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import FlipCard from './FlipCard/FlipCard.js';
import Card from './Card/Card.js';

import './Game.css';
import {
    FIBONACCI_NUMBERS,
    DEFAULT_POINT,
    ENDPOINT,
    USERTYPE
} from "../utils";

let socket;

const Game = ({ location }) => {

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(false);
    const [points, setPoints] = useState({});
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
    console.log('on (join and socet creation) use effect Called');
    const { name, room, type = USERTYPE } = queryString.parse(location.search);

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
    console.log("trying render");
    console.log("------------------------");
    console.log("type - ", type);
    console.log("room - ", room);
    console.log("users - ", users);
    console.log("points - ", points);
    console.log("------------------------");
    return (
        <div className="outerContainer">
            {type === "admin" ?
                (<div>
                    <SessionUrl room={room} />
                    {users.length ?
                        users.map((user,i) => (
                            <div key={i}>
                                <FlipCard name={user.name}
                                          point={points[user.name] || DEFAULT_POINT}
                                />
                            </div>))
                        :
                        <div>NoUser</div>}
                </div>)
                :
                type === "player" ?
                    (<div className="container">
                        <InfoBar room={room} />
                        {FIBONACCI_NUMBERS.map((number, i) =>
                            <div key={i}>
                                <Card cardNumber={number}
                                      selectedPoint={selectedPoint}
                                      sendEstimate={sendEstimate}
                                />
                            </div>)}
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>)
                : null
            }
            <TextContainer users={users}/>
        </div>
    );
};

export default Game;
