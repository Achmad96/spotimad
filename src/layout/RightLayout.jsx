import { useEffect, useState, useContext, useRef, useReducer } from "react";
import fetchPlaylistItems from "../utils/fetchPlaylistItems";
import { TokenContext } from "../App";
import { IoTimeSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const reducer = (state, action) => {
    if (action.type === "playlist") {
        state.playlist = true;
    } else if (action.type === "description") {
        state.description = true;
    } else if (action.type === "d_none") {
        state.description = false;
    } else if (action.type === "p_none") {
        state.playlist = false;
    }

    return { ...state };
};

const audio = new Audio();
export default function RightLayout(props) {
    const token = useContext(TokenContext);
    const { playlist, list_song } = props;
    const [list, setList] = useState({});
    const [state, dispatch] = useReducer(reducer, { playlist: false, description: false });
    const playlistEl = useRef(null);
    const description = useRef(null);

    const handlePlay = (src) => {
        if (src) {
            audio.volume = 0.03;
            audio.src = src;
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
        }

        if (description.current?.getBoundingClientRect().top + 182 < e.target.scrollTop) {
            dispatch({ type: "description" });
        }

        if (playlistEl.current?.getBoundingClientRect().bottom + 200 >= e.target.scrollTop) {
            dispatch({ type: "p_none" });
        }

        if (description.current?.getBoundingClientRect().top + 182 >= e.target.scrollTop) {
            dispatch({ type: "d_none" });
        }
    };

    return (
        <div
            className="flex flex-col w-full pt-3 h-[85vh] bg-gradient-to-b from-[#39E08C] to-[black] to-90% overflow-y-auto text-white ml-2 mt-3 rounded-t-xl"
            onScroll={handleScroll}
        >
            <div ref={playlistEl} className="text-7xl mb-20 font-bold">
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
                                <span className="opacity-70">1 jam 45 menit</span>
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
                                <span className="opacity-70">1 jam 45 menit</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col relative before:absolute before:bg-black before:opacity-50 before:top-0 before:left-0 before:right-0 before:bottom-0">
                <div
                    ref={description}
                    className="flex border-b mb-3 w-full items-center transition ease-in-out duration-300 opacity-70"
                >
                    <div className="p-3 ml-6 ">#</div>
                    <div className="ml-9">Judul</div>
                    <IoTimeSharp className="ml-[70%]" />
                </div>
                <AnimatePresence>
                    {state.playlist && playlist.name ? (
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
                    ) : (
                        state.playlist && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ ease: "easeInOut", duration: 0.3 }}
                                className="flex flex-row items-end fixed top-3 bg-[#228554] w-[83%] rounded-tl-xl z-50 py-3 gap-3 pl-10"
                            >
                                <img
                                    src={playlist?.items[0]?.images[0]?.url}
                                    alt="song"
                                    className="w-10 h-10 shadow-2xl"
                                ></img>
                                <div className="flex flex-col pl-3">
                                    <p className="text-xl">{playlist?.items[0]?.name}</p>
                                    <p className="text-sm ">
                                        {playlist?.items[0]?.owner?.display_name}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {state.description && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.9 }}
                            exit={{ opacity: 0 }}
                            transition={{ ease: "easeInOut", duration: 0.1 }}
                            className="flex fixed z-10 bg-[#165D3A] w-[83%] top-[83px] mb-3 items-center"
                        >
                            <div className="p-3 ml-6 ">#</div>
                            <div className="ml-9">Judul</div>
                            <IoTimeSharp className="ml-[70%]" />
                        </motion.div>
                    )}
                </AnimatePresence>
                {
                    // eslint-disable-next-line
                    list?.data?.items.map((v, i) => {
                        const name = v.track.name;
                        const img = v.track.album.images[0].url;
                        const class_name = `flex ${
                            i < 9 ? "ml-[18px]" : "ml-[10px]"
                        } p-3 gap-3 w-full hover:bg-[#2B3731]`;
                        if (v.track.preview_url) {
                            return (
                                <div
                                    key={v?.track?.id}
                                    className="flex relative items-center ml-5"
                                    onClick={() => {
                                        handlePlay(v.track.preview_url);
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
                        }
                    })
                }
            </div>
        </div>
    );
}
