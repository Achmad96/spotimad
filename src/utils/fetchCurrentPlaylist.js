import axios from "axios";
export default async function fetchCurrentPlaylist(token) {
    const url = "https://api.spotify.com/v1/me/playlists";
    const response = await axios({
        url,
        headers: {
            Authorization: "Bearer " + token
        }
    })
    return response
}