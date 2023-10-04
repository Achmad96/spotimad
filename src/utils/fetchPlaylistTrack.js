import axios from "axios";
export default async function fetchPlaylistTrack(token) {
  const url = "https://api.spotify.com/v1/me/tracks";
  const response = await axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
