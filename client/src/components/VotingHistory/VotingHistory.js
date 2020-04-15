import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './VotingHistory.css';

const VotingHistory = ({ history }) => (
    <div className="textContainer">
        <h1>Estimation History:</h1>
        <div className="activeContainer">
            {history && history.length ?
                history.map( stage => (
                    <div>
                        <h2>{stage.storyNumber}-{stage.storyTitle}</h2>
                        <h2>Avarage Point: {stage.avaragePoint}</h2>
                        {stage.users.map(({name, point}) => (
                            <h2>
                                <div key={name} className="activeItem">
                                    <img alt="Online Icon" src={onlineIcon}/>
                                    {name}
                                    <div>{point}</div>
                                </div>
                            </h2>
                        ))
                        }
                    </div>
                ))
                :
                <div>NoData</div>
            }
        </div>
    </div>
);

export default VotingHistory;