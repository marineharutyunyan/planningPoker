import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import SessionUrl from '../CreateSession/SessionUrl';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Game.css';

let socket;

const Game = ({ location }) => {
  const ENDPOINT = 'localhost:5000';
  const USERTYPE = "player";

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
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
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };
    return (
        <div className="outerContainer">
            {type === "admin" ?
                <SessionUrl room={room}    />
                :
                <div className="container">
                    <InfoBar room={room} />
                    <Messages messages={messages} name={name} />
                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                </div>
            }
            <TextContainer users={users}/>
        </div>
    );
};

export default Game;
