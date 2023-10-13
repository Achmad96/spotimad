import axios from "axios";
export default async function (token) {
    return await axios({
        url: "https://api.spotify.com/v1/me/player/currently-playing",
        method: "get",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
