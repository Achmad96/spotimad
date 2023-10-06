import axios from "axios";

export default async function fetchPlayer(token, context_uri) {
    const url = "https://api.spotify.com/v1/me/player/play";
    const response = await axios({
        url,
        method: "put",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: {
            context_uri,
            offset: {
                position: 1,
            },
            position_ms: 0,
        },
    });
    return response;
}
