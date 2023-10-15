import { useEffect, useState, useContext, useRef, useReducer } from "react";
import fetchHandler from "../utils/fetchHandler";
import { Token } from "../App";
import { IoTimeSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Song from "../components/Song";

const reducer = (state, action) => {
    // eslint-disable-next-line
    switch (action.type) {
        case "playlist":
            state.playlist = true;
            break;
        case "description":
            state.description = true;
            break;
        case "songs":
            state.songs = true;
            break;
        case "d_none":
            state.description = false;
            break;
        case "p_none":
            state.playlist = false;
            break;
        case "s_none":
            state.songs = false;
            break;
    }
    return { ...state };
};

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function RightLayout({ playlist_state, listSongId_state }) {
    const token = useContext(Token);
    const [playlist] = playlist_state;
    const [list, setList] = useState({});
    const [listSongId] = listSongId_state;

    const playlistEl = useRef(null);
    const description = useRef(null);
    const songsEl = useRef(null);
    const [state, dispatch] = useReducer(reducer, { playlist: false, description: false });

    useEffect(() => {
        const callData = async () => {
            if (token !== undefined && playlist) {
                const response = await fetchHandler(
                    token,
                    `/v1/playlists/${listSongId ? listSongId : playlist?.items[0]?.id}/tracks`
                );
                setList(response);
            }
        };
        callData();
    }, [token, listSongId, playlist]);
    const handleScroll = (e) => {
        if (playlistEl.current?.getBoundingClientRect().bottom + 200 < e.target.scrollTop) {
            dispatch({ type: "playlist" });
        } else if (playlistEl.current?.getBoundingClientRect().bottom + 200 >= e.target.scrollTop) {
            dispatch({ type: "p_none" });
        }

        if (description.current?.getBoundingClientRect().top + 177 < e.target.scrollTop) {
            dispatch({ type: "description" });
        } else if (description.current?.getBoundingClientRect().top + 177 >= e.target.scrollTop) {
            dispatch({ type: "d_none" });
        }

        if (songsEl.current?.getBoundingClientRect().top + 183 < e.target.scrollTop) {
            dispatch({ type: "songs" });
        } else if (songsEl.current?.getBoundingClientRect().top + 183 >= e.target.scrollTop) {
            dispatch({ type: "s_none" });
        }
    };

    return (
        <div
            className="flex flex-col w-full h-[84vh] bg-fixed overflow-y-auto text-white ml-2 my-3 rounded-xl"
            onScroll={handleScroll}
        >
            <div
                ref={playlistEl}
                className="w-full h-full bg-gradient-to-b from-[#39E08C] pb-5 to-[#121212] text-7xl font-bold"
            >
                <div className="flex flex-row items-end transition ease-in-out duration-300 py-5 gap-3 pl-10">
                    <img
                        src={playlist?.img ?? playlist?.items[0]?.images[0].url}
                        alt="song"
                        className="w-52 h-w-52 shadow-2xl"
                    ></img>
                    <div className="flex flex-col ml-5 gap-3">
                        <div>
                            <p className="text-sm">Playlist</p>
                            <p className="text-6xl">{playlist?.name ?? playlist?.items[0].name}</p>
                        </div>
                        <p className="text-base">
                            {playlist?.owner ?? playlist?.items[0]?.owner?.display_name} ▪{" "}
                            <span className="font-light">
                                {playlist?.tracks ?? playlist?.items[0]?.tracks?.total} lagu
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div ref={songsEl} className="w-full bg-[#121212]">
                <div
                    ref={description}
                    className="flex border-b mt-14 border-b-gray-500 items-center opacity-70"
                >
                    <div className="p-3 ml-6">#</div>
                    <div className="ml-5">Judul</div>
                    <IoTimeSharp className="ml-[70%]" />
                </div>
                <AnimatePresence>
                    {state.playlist && playlist.name && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ ease: "easeInOut", duration: 0.3 }}
                            className="flex flex-row items-end fixed top-3 bg-[#228554] w-[83%] rounded-tl-xl z-50 py-3 gap-3 pl-10"
                        >
                            <img
                                src={playlist?.img}
                                alt="song"
                                className="w-10 h-10 shadow-2xl"
                            ></img>
                            <div className="flex flex-col pl-3">
                                <p className="text-xl">{playlist?.name}</p>
                                <p className="text-sm ">{playlist?.owner}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {state.description && (
                        <motion.div
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ ease: "easeInOut", duration: 0.1 }}
                            className="flex opacity-100 fixed z-10 bg-[#1c1c1c] w-[83%] top-[84px] mb-3 items-center"
                        >
                            <div className="p-3 ml-6 ">#</div>
                            <div className="ml-5">Judul</div>
                            <IoTimeSharp className="ml-[70%]" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="py-7 min-h-[38vh]">
                    {
                        // eslint-disable-next-line
                        list?.data?.items
                            .filter((v) => v.track.preview_url !== undefined)
                            .map((v, i) => {
                                const name = v.track.name;
                                const img = v.track.album.images[0].url;
                                const artists = v.track.artists.map((v) => v.name).join(", ");
                                const class_name = `flex ${
                                    i < 9 ? "ml-[10px]" : "ml-[2px]"
                                } p-3 gap-3 w-full`;
                                return (
                                    <Song
                                        key={v?.track?.id}
                                        className={class_name}
                                        index={i}
                                        name={name}
                                        img={img}
                                        artists={artists}
                                        duration_ms={millisToMinutesAndSeconds(v.track.duration_ms)}
                                    />
                                );
                            })
                    }
                </div>
            </div>
        </div>
    );
}
