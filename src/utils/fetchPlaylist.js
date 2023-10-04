import axios from "axios";
export default async function fetchPlaylist(access_token) {
  const response = await axios({
    url: `https://api.spotify.com/v1/users/${process.env.REACT_APP_USER_ID}/playlists`,
    method: "get",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response;
}
