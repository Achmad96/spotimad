import { useState, useEffect, useContext } from "react";
import { Token } from "../App";
import fetchHandler from "../utils/fetchHandler";
export default function Playlist({ playlist_state, listSongId_state }) {
    const [listSong, setListSong] = useState({});
    const [, setPlaylist] = playlist_state;
    const [listSongId, setListSongId] = listSongId_state;
    const token = useContext(Token);

    useEffect(() => {
        const callData = async () => {
            if (token !== undefined) {
                const response = await fetchHandler(
                    token,
                    `/v1/users/${process.env.REACT_APP_USER_ID}/playlists`
                );
                setListSong(response.data);
                setPlaylist(response.data);
            }
        };
        callData();
    }, [token, setPlaylist]);

    return (
        <div className="flex flex-col bg-[#121212] w-60 h-[68vh] overflow-y-auto text-white rounded-xl gap-2">
            {listSong?.items?.map((v, i) => {
                const class_name = `flex gap-3 hover:bg-zinc-700 w-full p-5 ${
                    listSongId === v.id ? "bg-zinc-700" : ""
                }`;
                if (!listSong) {
                    setPlaylist({
                        id: v.id,
                        name: v.name,
                        tracks: v.tracks.total,
                        img: v.images[0],
                        context_uri: v.uri,
                    });
                }
                return (
                    <div
                        key={v.id}
                        className={class_name}
                        onClick={() => {
                            setListSongId(v.id);
                            setPlaylist({
                                id: v.id,
                                name: v.name,
                                tracks: v.tracks.total,
                                img: v.images[0].url,
                                owner: v.owner.display_name,
                                context_uri: v.uri,
                                index: i,
                            });
                        }}
                    >
                        <img
                            src={v.images[i].url}
                            alt="playlist"
                            className="w-20 h-20 rounded-xl"
                        ></img>
                        <div className="flex flex-col gap-1">
                            <p className="text-lg">{v.name}</p>
                            <p className="text-sm opacity-50">{v.tracks.total} lagu</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
