import axios from "axios";

export default async function fetchPlaylistItems(token, playlist_id) {
    const response = await axios({
        url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        method: "get",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}
