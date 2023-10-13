import axios from "axios";
export default function (token, type) {
    const url = `https://api.spotify.com/v1/me/player/${type}`;
    return axios({
        url,
        method: "post",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
