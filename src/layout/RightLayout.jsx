import { useEffect, useState, useContext, useRef, useReducer } from "react";
import fetchPlaylistItems from "../utils/fetchPlaylistItems";
import { TokenContext } from "../App";
import { IoTimeSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

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

const audio = new Audio();

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function RightLayout(props) {
    const token = useContext(TokenContext);
    const { playlist, list_song, volumeState, selectedSongState } = props;
    const [volume] = volumeState;
    const [, setSelectedSong] = selectedSongState;
    const [list, setList] = useState({});
    const playlistEl = useRef(null);
    const description = useRef(null);
    const songsEl = useRef(null);

    const [state, dispatch] = useReducer(reducer, { playlist: false, description: false });

    audio.volume = volume;
    const handlePlay = (src, object) => {
        if (src) {
            audio.src = src;
            setSelectedSong(object);
            audio.play();
        }
    };

    useEffect(() => {
        const callData = async () => {
            if (token && playlist) {
                const response = await fetchPlaylistItems(
                    token,
                    list_song ? list_song : playlist?.items[0]?.id
                );
                setList(response);
            }
        };
        callData();
    }, [token, list_song, playlist]);
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
            className="flex flex-col w-full h-[85vh] bg-fixed overflow-y-auto text-white ml-2 my-3 rounded-xl"
            onScroll={handleScroll}
        >
            <div
                ref={playlistEl}
                className="w-full h-full bg-gradient-to-b from-[#39E08C] pb-5 to-[#121212] text-7xl font-bold"
            >
                {playlist?.name ? (
                    <div className="flex flex-row items-end transition ease-in-out duration-300 py-5 gap-3 pl-10">
                        <img
                            src={playlist?.img}
                            alt="song"
                            className="w-52 h-w-52 shadow-2xl"
                        ></img>
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm">Playlist</p>
                                <p className="text-6xl">{playlist?.name}</p>
                            </div>
                            <p className="text-base">
                                {playlist?.owner} ▪ {playlist?.tracks} lagu,{" "}
                                {millisToMinutesAndSeconds(
                                    list?.data.items[playlist?.index].track.duration_ms
                                )}{" "}
                                <span className="opacity-70"></span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row items-end transition ease-in-out duration-300 py-5 gap-3 pl-10">
                        <img
                            src={playlist?.items[0]?.images[0].url}
                            alt="song"
                            className="w-52 h-w-52 shadow-2xl"
                        ></img>
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm">Playlist</p>
                                <p className="text-6xl">{playlist?.items[0].name}</p>
                            </div>
                            <p className="text-base">
                                {playlist?.items[0].owner.display_name} ▪{" "}
                                {playlist?.items[0].tracks.total} lagu,{" "}
                                <span className="opacity-70">
                                    {millisToMinutesAndSeconds(
                                        list?.data?.items[0].track.duration_ms
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
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
                                const class_name = `flex ${
                                    i < 9 ? "ml-[10px]" : "ml-[2px]"
                                } p-3 gap-3 w-full`;
                                return (
                                    <div
                                        key={v?.track?.id}
                                        className="flex items-center ml-4 mr-4 rounded-md hover:bg-[#2B3731]"
                                        onClick={() => {
                                            handlePlay(v.track.preview_url, {
                                                name: v.track.name,
                                                artists: v.track.artists
                                                    .map((v) => v.name)
                                                    .join(", "),
                                                id: v.id,
                                                img: v.track.album.images[0].url,
                                            });
                                        }}
                                    >
                                        <p className="p-5">{i + 1}</p>
                                        <div className={class_name}>
                                            <img src={img} alt="song" className="w-10 h-10"></img>
                                            <div>
                                                <p className="text-base">{name}</p>
                                                <p className="text-xs opacity-50">
                                                    {v.track.artists.map((v) => v.name).join(", ")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </div>
    );
}
