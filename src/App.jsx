import { useEffect } from "react";
import { createContext, useState } from "react";

import "./App.css";
import LeftLayout from "./layout/LeftLayout";
import RightLayout from "./layout/RightLayout";
import BottomLayout from "./layout/BottomLayout";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();
const scope = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-library-read",
    "user-read-currently-playing",
].join("%20");

export const TokenContext = createContext();
export default function App() {
    const [songListId, setSongListId] = useState();
    const [token, setToken] = useState();
    const [playlist, setPlaylist] = useState();
    const [selectedSong, setSelectedSong] = useState();
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        const clientId = process.env.REACT_APP_BASIC_CLIENT_ID;
        const redirectUri = process.env.REACT_APP_REDIRECT_URI;
        const hashParams = window.location.hash
            .substring(1)
            .split("&")
            .reduce((acc, param) => {
                const [key, value] = param.split("=");
                acc[key] = decodeURIComponent(value);
                return acc;
            }, {});

        if (hashParams.access_token) {
            setToken(hashParams.access_token);
            spotifyApi.setAccessToken(hashParams.access_token);
        } else {
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
        }
        window.history.pushState({}, null, "/");
    }, []);

    return (
        <main className="flex flex-col bg-black h-screen overflow-hidden">
            <TokenContext.Provider value={token}>
                <div className="flex flex-row">
                    <LeftLayout
                        setPlaylist={setPlaylist}
                        songListState={[songListId, setSongListId]}
                    />
                    <RightLayout
                        playlist={playlist}
                        list_song={songListId}
                        volumeState={[volume, setVolume]}
                        selectedSongState={[selectedSong, setSelectedSong]}
                    />
                </div>
                <BottomLayout
                    token={token}
                    volumeState={[volume, setVolume]}
                    selectedSongState={[selectedSong, setSelectedSong]}
                />
            </TokenContext.Provider>
        </main>
    );
}
