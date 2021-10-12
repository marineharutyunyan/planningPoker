import React from "react";
import './Topic.css';
import Select from '@northstar/core/Select';
import MenuItem from '@northstar/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@northstar/core/FormControl';
import InputLabel from '@northstar/core/InputLabel';
import {
  withStyles,
} from '@material-ui/core/styles';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
        color: '#0071bc',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#0071bc',
    }},
})(TextField);


export default function Topic({
     startGame,
     reStartGame,
     isGameStarted,
     storyTitle,
     setStoryTitle,
     areCardsOpen,
     openCards,
     backlog
}) {
    const isDisabled = isGameStarted && !areCardsOpen

    const onSelectChange = ({target: {value}}) => {
        if(!(isDisabled) ) {
            setStoryTitle(value);
        }
    };

    return (
        <div className="user-story-info-container" >
            {
                backlog && backlog.length > 0 && !isDisabled ?
                    <FormControl>
                        <InputLabel>User story name</InputLabel>
                        <Select variant="outlined"
                                label="User Story Name"
                                onChange={onSelectChange}
                                disabled={isDisabled}
                                fullWidth
                        >
                            {
                                backlog.map((value, index) => {
                                    return <MenuItem key={index} name={value.key} value={`${value.key}: ${value.fields.summary}`}>{value.key}: {value.fields.summary}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    :
                    <form className="form" noValidate autoComplete="off">
                        <CssTextField
                            label="Story Description"
                            fullWidth
                            multiline={true}
                            disabled={isDisabled}
                            value={storyTitle}
                            onChange={({target: {value}}) => !(isDisabled) ? setStoryTitle(value): null}
                            onKeyPress={e => e.key === 'Enter' ? startGame(e) : null}
                        />
                        {/*{
                            !(isDisabled) &&
                            storyTitle &&
                            <span className="clearIcon" onClick={() => setStoryTitle("")}>X</span>
                        }*/}
                    </form>
                }
            <div className="action-buttons-wrapper">
                <button className="button send-button mt-20"
                        disabled={isDisabled}
                        onClick={startGame}
                >
                    Start Voting
                </button>
                <button className="button ml-20 mt-20 open-cards-button"
                        disabled={!isGameStarted || areCardsOpen}
                        onClick={openCards}>
                    Open Cards
                </button>
                <button className="button ml-20 mt-20 stop-game-button"
                        disabled={!isGameStarted || areCardsOpen}
                        onClick={()=> reStartGame()}>
                    Discard
                </button>
            </div>
        </div>
    )
};
