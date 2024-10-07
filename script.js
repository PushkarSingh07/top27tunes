// Spotify credentials (replace with your own)
const client_id = '6de769c71903403cb2b10d99a3496729';  // Replace with your Client ID
const redirect_uri = 'http://localhost:5500'; // Your redirect URI
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state'
];

// Dummy Top 10 Songs (Replace these IDs with your own tracks)
const topTracks = [
    { id: '1lDWb6b6ieDQ2xT7ewTC3G', name: 'Blinding Lights', artist: 'The Weeknd' },
    { id: '7szuecWAPwGoV1e5vGu8tl', name: 'Shape of You', artist: 'Ed Sheeran' },
    { id: '6I3mqTwhRpn34SLVafSH7G', name: 'Rockstar', artist: 'Post Malone' },
    { id: '0e7ipj03S05BNilyu5bRzt', name: 'Levitating', artist: 'Dua Lipa' },
    { id: '4pbG9SUmWIvsROVLF0zF9s', name: 'Sugar', artist: 'Maroon 5' },
    { id: '3tjFYV6RSFtuktYl3ZtYcq', name: 'Stressed Out', artist: 'Twenty One Pilots' },
    { id: '4w8niZpiMy6qz1mntFA5uM', name: 'Memories', artist: 'Maroon 5' },
    { id: '1pKYYY0dkg23sQQXi0Q5zN', name: 'Dance Monkey', artist: 'Tones and I' },
    { id: '5PYQUBXc7NYeI1obMKSJK0', name: 'Watermelon Sugar', artist: 'Harry Styles' },
    { id: '7a53HqqArd4b9NF4XAmlbI', name: 'Lucid Dreams', artist: 'Juice WRLD' }
];

// Authorization and Token
document.getElementById('login-btn').addEventListener('click', () => {
    window.location = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
});

// Extract Access Token from URL
window.onload = () => {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
        if (item) {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    window.location.hash = '';
    let _token = hash.access_token;

    if (_token) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('player').style.display = 'block';
        displayTopSongs();

        const player = new Spotify.Player({
            name: 'Spotify Web Player',
            getOAuthToken: cb => { cb(_token); }
        });

        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        player.addListener('player_state_changed', state => {
            if (!state) return;
            const { current_track } = state.track_window;
            document.getElementById('track-name').innerText = current_track.name;
            document.getElementById('artist-name').innerText = current_track.artists.map(artist => artist.name).join(', ');
            document.getElementById('album-art').src = current_track.album.images[0].url;
        });

        player.connect();

        // Play and Pause button events
        document.getElementById('play-btn').addEventListener('click', () => {
            player.resume();
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
            player.pause();
        });
    }
};

// Display Top 10 Songs
function displayTopSongs() {
    const songList = document.getElementById('song-list');
    topTracks.forEach(track => {
        const li = document.createElement('li');
        li.innerText = `${track.name} - ${track.artist}`;
        li.addEventListener('click', () => playTrack(track.id));
        songList.appendChild(li);
    });
}

// Play track by Spotify track ID
function playTrack(trackId) {
    fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
        headers: {
            'Authorization': `Bearer ${_token}`,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 204) {
            console.log(`Playing track: ${trackId}`);
        } else {
            console.error('Failed to play track');
        }
    });
}

// Day/Night Mode Toggle
const themeToggleBtn = document.getElement


