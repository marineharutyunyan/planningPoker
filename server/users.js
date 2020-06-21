const users = [];
const history= {};
const {ADMIN_USER_TYPE} = require('./utils');

const addUser = ({ id, name, type, room }) => {
  const displayName = name;
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, displayName,  type, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getAdminUser = () => users.find((user) => user.type === ADMIN_USER_TYPE);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getVotingHistory = room => history[room] || [];

const setVotingHistory = ({room, users, points, avaragePoint, storyNumber, storyTitle}) => {
    if (users && users.length) {
        const lastEstimation = {users:[], avaragePoint, storyNumber, storyTitle};
        users.forEach((user) => {
            lastEstimation.users.push({
                name: user.name,
                displayName:user.displayName,
                point: points[user.name],
                type: user.type
            });
        });

        if (history.hasOwnProperty(room)) {
            history[room].push(lastEstimation);
        } else {
            history[room] = [lastEstimation];
        }
    }
    return history
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAdminUser,
    getVotingHistory,
    setVotingHistory
};