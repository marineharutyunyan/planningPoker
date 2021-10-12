export default {
     fetchIssues: async (tokenType, accessToken, id, selectedProject) => {
        try {
            const url = `https://api.atlassian.com/ex/jira/${id}/rest/api/2/search?jql=project%20%3D%20${selectedProject}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${tokenType} ${accessToken}`
                },
            });
            const data = await response.json();
            console.log('Success Get backlog issues list:', data);
            return data.issues;
        } catch (error) {
            console.error('Error:', error);
        }
    }
}