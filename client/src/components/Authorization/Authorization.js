import React, { useState, useEffect} from 'react';
import { Redirect } from "react-router-dom";
import queryString from 'query-string';
import './Authorization.css';
import SelectProject from './SelectProject.js';
import CircularProgress from '@northstar/core/CircularProgress';

export default function Authorization({ location }) {
    const { code, state } = queryString.parse(location.search);
    const [testAPI, setTestAPI] = useState('');
    const [accessToken, setAccessToken] = React.useState('');
    const [tokenType, setTokenType] = React.useState('');
    const [id, setId] = React.useState(null);
    const [projects, setProjects] = React.useState(null);
    const [backlog, setBacklog] = React.useState(null);
    const [selectedProject, setSelectedProject] = React.useState('');

    const getCloudId = ({access_token, token_type}) => {
        setAccessToken(access_token);
        setTokenType(token_type);
        fetch('https://api.atlassian.com/oauth/token/accessible-resources ', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('SuccessCloudId:', data);
                const {id} = data[0];
                setId(id);
                getProjects(token_type, access_token, id)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const getProjects = ( token_type, access_token, id ) => {
        const url = `https://api.atlassian.com/ex/jira/${id}/rest/api/2/project/search`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success Get Backlog:', data);
            setProjects(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const filterBacklogIssues = ( issues ) => {
        return issues.filter(issue => issue.fields.customfield_10020 === null);
    };

    const getBacklog = ( selectedProject ) => {
    const url = `https://api.atlassian.com/ex/jira/${id}/rest/api/2/search?jql=project%20%3D%20${selectedProject}`;
    //if in this response customfield_10020 custom field's value is null then it's in backlog
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${tokenType} ${accessToken}`
            },
        })
            .then(response => response.json())
            .then(data => {
                const backlogIssues = filterBacklogIssues(data.issues);
                setBacklog(backlogIssues);
                console.log('Success Get issues list:', data, 'backlog issues list', backlogIssues);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetch('http://localhost:5000/testAPI').then(res=> res.text()).then(res => setTestAPI(res));

        const data ={
            grant_type: 'authorization_code',
            client_id: 'UjZJ3xXvXyrftnikidpY5O2VfmRjtpwA',
            client_secret: 'vPMpCRfdW2yoJ3xcaqipvVFFs59LPM6WabD_H1WCJzDpufq8LAh8476UXikPPEOE',
            code,
            redirect_uri: 'http://localhost/callback1',
        };

        fetch('https://auth.atlassian.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            getCloudId(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);

    return (
        backlog ?
            <Redirect to={{
                pathname: '/',
                state: {
                    selectedProject,
                    backlog,
                    accessToken,
                    tokenType,
                    id
                }
            }} />
            :
            <div className="joinOuterContainer">
                <div className="joinInnerContainer">
                    {
                        projects ?
                            <>
                                <h1 className="heading">Select the project</h1>
                                <SelectProject data={projects} onSelect={setSelectedProject} />
                                <button className={'button mt-20'}
                                    onClick={e  =>  {
                                        e.preventDefault();
                                        if (selectedProject !== '') {
                                            getBacklog(selectedProject);
                                        }
                                    }}
                                >
                                    Next
                                </button>
                            </>
                                :
                                <CircularProgress />
                    }
                </div>
            </div>
    );
}
