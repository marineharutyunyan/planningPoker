import axios from 'axios';

export default {
    getAccessToken: async (code) => {
        const url ='https://auth.atlassian.com/oauth/token';
        //const url ='http://localhost:5000/backlog';
        //const url ='http://dps.helpsystems.com/rest/agile/1.0/board/1850/backlog';
        const data ={
            grant_type: 'authorization_code',
            client_id: 'GQAVaw6GMWqJXENk0ExliBS3enwjYOzh',
            client_secret: 'QaMz9N8SvJ_6ge3N1HVOlQsBhWeiHR9VnlTZZL0WwhO7ABnbF2aX16aSyb7lVb1s',
            code,
            redirect_url: 'http://localhost:3000/callback',
        };
        return axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
};
