import axios from "axios";
export default function (token, device_id) {
    const url = `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`;
    return axios({
        url,
        method: "put",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
