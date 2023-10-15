import axios from "axios";
export default async function (token, endpoint, method = "get", args) {
    return await axios({
        url: `https://api.spotify.com${endpoint}`,
        method,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        ...args,
    });
}
