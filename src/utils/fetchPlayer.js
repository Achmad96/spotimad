import axios from "axios";
export default async function (token, device_id, context_uri, position) {
    console.log("file: fetchPlayer.js:3 ~ position:", position);
    console.log("file: fetchPlayer.js:3 ~ context_uri:", context_uri);
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`;
    const response = await axios({
        url,
        method: "put",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: {
            context_uri,
            offset: {
                position,
            },
            position_ms: 0,
        },
    });
    return response;
}
