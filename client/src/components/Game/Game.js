import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import SessionUrl from '../CreateSession/SessionUrl';
import TextContainer from '../TextContainer/TextContainer';
//import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import FlipCard from './FlipCard/FlipCard.js';

import './Game.css';

const cards = ['0','1','2','3','5','8','13','20','40','100','?'];
let socket;

const Game = ({ location }) => {
  const ENDPOINT = 'localhost:5000';
  const USERTYPE = "player";

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [point, setEstimate] = useState('?');
  const [points, setPoints] = useState({});
  const [message, setMessage] = useState('');
/*  const [messages, setMessages] = useState([]);*/

  useEffect(() => {
    const { name, room, type = USERTYPE } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);
    setType(type);

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
        socket.on('message', (data) => {
            console.log("recivedMessage!!!!");
            debugger;
            points[data.user] = data.point;
            setPoints(points);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [point, points]);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };
  const sendEstimate = (event, estimateNumber) => {
    event.preventDefault();

    if(estimateNumber) {
      socket.emit('sendEstimate', estimateNumber, () => setEstimate('?'));
    }
  };
    return (
        <div className="outerContainer">
            {type === "admin" ?
                <SessionUrl room={room}    />
                :
                <div className="container">
                    <InfoBar room={room} />
                    {cards.map((card, i) =>
                        <div key={i}>
                            <FlipCard cardNumber={card}
                                      setEstimate={setEstimate}
                                      sendEstimate={sendEstimate}
                                      name={card}/>
                        </div>)}
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                </div>
            }
            {name}
            <TextContainer users={users}/>
        </div>
    );
};

export default Game;
