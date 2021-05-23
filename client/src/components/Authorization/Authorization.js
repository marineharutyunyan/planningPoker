import React, { useState, useEffect} from 'react';
import queryString from 'query-string';
import './Authorization.css';

export default function Authorization({ location }) {
    const { code, state } = queryString.parse(location.search);
    const [testAPI, setTestAPI] = useState('');

    const getCloudId = ({access_token, expires_in, scope, token_type}) => {
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
                getBacklog(token_type, access_token, data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const getAllFieldsForSpecificProject = ( token_type, access_token, id ) => {
        fetch(`https://api.atlassian.com/ex/jira/${id}/rest/api/2/issue/createmeta?projectKeys=KEY&expand=projects.issuetypes.fields`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`
            },
        })
        .then(data => {
            console.log('SuccessAllFields:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const updateStoryPoint = ( token_type, access_token, id ) => {
        const point = prompt('Please enter the story point for PLN-1');
        const url = `https://api.atlassian.com/ex/jira/${id}/rest/api/2/issue/PLN-1`;
        fetch(url , {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`
            },
            body: JSON.stringify({
                "fields": {
                    "description": "Maaaaaaa",
                    "customfield_10028": parseInt(point)
                }
            })
        })
        .then(data => {
            console.log('SuccessBacklog:', data);
            alert("Thank you, estimate successfully updated !");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const getBacklog = ( token_type, access_token, data ) => {
        //const {id, name, scope, avatarUrl} = data[0];
        const { id } = data[0];
        fetch(`https://api.atlassian.com/ex/jira/${id}/rest/api/2/search?jql=issuetype=story`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`
            },
        })
            .then(data => {
                console.log('SuccessBacklog:', data);
                //getAllFieldsForSpecificProject(token_type, access_token, id);
                updateStoryPoint(token_type, access_token, id)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetch('http://localhost:5000/testAPI').then(res=> res.text()).then(res => setTestAPI(res));
    });

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">{code} - {state} - {testAPI}</h1>
                <button className={'button mt-20'}
                        onClick={e  =>  {
                            e.preventDefault();
                            const data ={
                                grant_type: 'authorization_code',
                                client_id: 'GQAVaw6GMWqJXENk0ExliBS3enwjYOzh',
                                client_secret: 'QaMz9N8SvJ_6ge3N1HVOlQsBhWeiHR9VnlTZZL0WwhO7ABnbF2aX16aSyb7lVb1s',
                                code,
                                redirect_uri: 'http://localhost:3000/callback1',
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
                        }}
                >
                    Authorize
                </button>
            </div>
        </div>
    );
}
