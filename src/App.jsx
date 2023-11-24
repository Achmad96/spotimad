import { useEffect } from "react";
import { createContext, useState } from "react";

import "./App.css";
import LeftLayout from "./layout/LeftLayout";
import RightLayout from "./layout/RightLayout";
import BottomLayout from "./layout/BottomLayout";

const scope = [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-library-read",
    "user-read-currently-playing",
    "user-modify-playback-state",
].join("%20");

export const Token = createContext();
export default function App() {
    const [token, setToken] = useState();
    const [playlist, setPlaylist] = useState();

    useEffect(() => {
        const clientId = process.env.REACT_APP_BASIC_CLIENT_ID;
        const redirectUri = process.env.REACT_APP_BASIC_REDIRECT_URI;
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
        } else {
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
        }
        window.history.pushState({}, null, "/");
    }, []);

    return (
        <Token.Provider value={token}>
            <main className="flex flex-col bg-black h-screen overflow-hidden">
                <div className="flex flex-row">
                    <LeftLayout playlist_state={[playlist, setPlaylist]} />
                    <RightLayout playlist_state={[playlist, setPlaylist]} />
                </div>
                <BottomLayout />
            </main>
        </Token.Provider>
    );
}
