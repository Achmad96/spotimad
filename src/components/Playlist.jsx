import { useState, useEffect, useContext } from "react";
import fetchPlaylist from "../utils/fetchPlaylist";
import { TokenContext } from "../App";
export default function Playlist(props) {
    const [list, setList] = useState({});
    const { setPlaylist, songListState } = props;
    const [songListId, setSongListId] = songListState;
    const token = useContext(TokenContext);
    useEffect(() => {
        const callData = async () => {
            if (token !== undefined) {
                const response = await fetchPlaylist(token);
                setList(response.data);
                setPlaylist(response.data);
            }
        };
        callData();
    }, [token, setPlaylist]);

    return (
        <div className="flex flex-col bg-[#121212] w-60 h-[68vh] overflow-y-auto text-white rounded-xl gap-2">
            {list?.items?.map((v, i) => {
                const class_name = `flex gap-3 hover:bg-zinc-700 w-full p-5 ${
                    songListId === v.id ? "bg-zinc-700" : ""
                }`;
                if (!list) {
                    setPlaylist({
                        id: v.id,
                        name: v.name,
                        tracks: v.tracks.total,
                        img: v.images[0],
                    });
                }
                return (
                    <div
                        key={v.id}
                        className={class_name}
                        onClick={() => {
                            setSongListId(v.id);
                            setPlaylist({
                                id: v.id,
                                name: v.name,
                                tracks: v.tracks.total,
                                img: v.images[0].url,
                                owner: v.owner.display_name,
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
