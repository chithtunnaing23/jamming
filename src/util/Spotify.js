let accessToken = '';
let expirationTime = 0;
const redirectURI = "https://jammingbychn.netlify.app/";

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }else{
            accessToken = window.location.href.match(/access_token=([^&]*)/);
            expirationTime = window.location.href.match(/expires_in=([^&]*)/);
            if(accessToken && expirationTime){
                accessToken = accessToken[1];
                expirationTime = expirationTime[1];
                window.setTimeout(() => accessToken = '', expirationTime * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            } else{
                window.location = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`      
            }
        }
    },

    async search(term){
        this.getAccessToken();
        try {const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type': 'application/json'
            }
        });
        if(response.ok){
            const jsonResponse = await response.json();
            let tracks = jsonResponse.tracks.items;
            tracks = tracks.map(track => {
                return({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                })
            })
            return tracks;
        }
        throw new Error('Request failed!');
        } catch(error){
            console.log(error);
            return [];
        }
    },

    savePlaylist(playlistName, trackURIArray){
        if(!playlistName || !trackURIArray){
            return;
        }
        while(!accessToken){
            this.getAccessToken();
        }

        //id variables
        let user_ID;
        let playlist_ID;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        }

        fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed! (on getting userID) code-' + response.status)
        }).then(jsonResponse => {
            console.log(jsonResponse);
            user_ID = jsonResponse.id;
        }).then(() => 
        fetch(`https://api.spotify.com/v1/users/${user_ID}/playlists/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'name': playlistName,
                'description': 'playlist created by Jamming webapp',
            })
        }))
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error('Request failed! (on creating) code-' + response.status)
        }).then(jsonResponse => {
            playlist_ID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/playlists/${playlist_ID}/tracks/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    'uris': trackURIArray
                })
            })
        }).then(response => {
            if(response.ok){
                return 0;
            }
            throw new Error('Request failed! (on adding tracks) code-' + response.status)
        }).catch(error => {
            console.log(error);
        })

    }
}

export default Spotify;