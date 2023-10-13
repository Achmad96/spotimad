import axios from "axios";
export default async function fetchUserQueue(token) {
    return await axios({
        url: "https://api.spotify.com/v1/me/player/queue",
        method: "get",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
