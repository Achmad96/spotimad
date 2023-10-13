import axios from "axios";
export default async function (access_token) {
    const profile = await axios({
        url: `https://api.spotify.com/v1/users/${process.env.REACT_APP_USER_ID}`,
        method: "get",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return profile;
}
