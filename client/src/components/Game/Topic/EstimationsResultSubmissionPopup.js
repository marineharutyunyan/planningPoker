import React from 'react';
import { makeStyles } from '@northstar/core/styles';
import DialogTitle from '@northstar/core/DialogTitle';
import DialogContentText from '@northstar/core/DialogContentText';
import DialogContent from '@northstar/core/DialogContent';
import DialogActions from '@northstar/core/DialogActions';
import Dialog from '@northstar/core/Dialog';
import Button from '@northstar/core/Button';
import ReactEmoji from "react-emoji";
import {DEFAULT_USER_TYPE} from "../../utils";

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        margin: 0,
    },
});

export default function EstimationsResultSubmissionPopup({
    setShowPopup,
    history,
    storyTitle,
    authCredentials,
    reEstimate,
    startGame,
    deleteEstimation,
    updateBacklog
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const updateStoryPoint = ( token_type, access_token, id ) => {
        const point = history.averageConvertedToFib;//prompt('Please enter the story point for POK-1');
        const storyName= storyTitle.split(':')[0];

        const url = `https://api.atlassian.com/ex/jira/${id}/rest/api/2/issue/${storyName}`;
        fetch(url , {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`
            },
            body: JSON.stringify({
                "fields": {
                    //"description": "Maaaaaaa",
                    "customfield_10026": parseInt(point)
                }
            })
        })
        .then(data => {
            console.log('Success updateStoryPoint:', data);
            //alert("Thank you, estimate successfully updated !");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleClose = () => {
        setShowPopup(false)
        setOpen(false);
        deleteEstimation(history.id);
    };

    const handleReEstimate = () => {
        setShowPopup(false)
        setOpen(false);
        reEstimate(history.id, storyTitle);
        startGame();
        deleteEstimation(history.id);
    };


    const handleConfirm = () => {
        const {tokenType, accessToken, id, selectedProject} = authCredentials
        updateStoryPoint(tokenType, accessToken, id);
        updateBacklog(tokenType, accessToken, id, selectedProject);
        setShowPopup(false)
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {storyTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div className="averageNumber inline-block">
                            Average fibonacci number: {history.averageConvertedToFib}
                        </div>
                        <div className="averageNumber">
                            Average number: {history.averagePoint}
                        </div>
                        <ul className="participantsVotes">
                            {
                                history.users.map(({displayName, type, point}, i) => (
                                    type === DEFAULT_USER_TYPE  &&
                                    <li key={i}>
                                        {ReactEmoji.emojify(displayName)}{`: ${point || " ?" }`}
                                    </li>
                                ))
                            }
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancle
                    </Button>
                    <Button onClick={handleReEstimate} color="primary" >
                        Revote
                    </Button>
                    <Button onClick={handleConfirm} color="secondary"  variant="contained" autoFocus>
                        Submit Estimate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

