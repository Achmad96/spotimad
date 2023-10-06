import { useEffect, useState, useContext, useRef, useReducer } from "react"
import fetchPlaylistItems from "../utils/fetchPlaylistItems"
import { TokenContext } from "../App";
import fetchPlayer from "../utils/fetchPlayer";
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

    return {...state};
}

export default function RightLayout(props){
    const token = useContext(TokenContext);
    const [list, setList] = useState({});
    const [state, dispatch] = useReducer(reducer, { playlist: false, description: false });
    const handlePlay = async (token, track) => {
        await fetchPlayer(token, track).catch(err => console.log(err));
    }
    const playlistEl = useRef(null);
    const description = useRef(null);

    useEffect(() => {
        const callData = async () => {
            if (token) {
                const response = await fetchPlaylistItems(token, props.list_song ? props.list_song : process.env.REACT_APP_PLAYLIST_ID);
                setList(response);
            }
        }
        callData();
    }, [token, props.playlist]);

    const handleScroll = (e) => {
        if ((playlistEl.current?.getBoundingClientRect().bottom + 180) < e.target.scrollTop) {
            dispatch({type:  "playlist"});
        }
        
        if ((description.current?.getBoundingClientRect().top + 180) <= e.target.scrollTop) {
            dispatch({type:  "description"});
        }
        
        if ((playlistEl.current?.getBoundingClientRect().bottom + 180) > e.target.scrollTop) {
            dispatch({type:  "p_none"});
        }
        
        if ((description.current?.getBoundingClientRect().top + 180) > e.target.scrollTop) {
            dispatch({type:  "d_none"});
        }

    }

    return (
        <div className="flex flex-col w-full pt-3 h-[85vh] bg-gradient-to-b from-[#39E08C] via-[#228554] to-[black] via-50% to-90% overflow-y-auto text-white ml-2 mt-3 rounded-t-xl" onScroll={handleScroll}>
            <div ref={playlistEl} className="text-7xl mb-20 font-bold">
                {props.playlist?.name && (
                    <div className="flex flex-row items-end transition ease-in-out duration-300 py-5 gap-3 pl-10">
                        <img src={props.playlist?.img} alt="song" className="w-52 h-w-52 shadow-2xl"></img>
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm">Playlist</p>
                                <p className="text-6xl">{props.playlist?.name}</p>
                            </div>
                                <p className="text-base">{props.playlist?.owner} ▪ {props.playlist?.tracks} lagu, <span className="opacity-70">1 jam 45 menit</span></p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col relative before:absolute before:bg-black before:opacity-75 before:top-0 before:left-0 before:right-0 before:bottom-0">
                <div ref={description} className="flex border-b mb-3 w-full items-center transition ease-in-out duration-300 opacity-70">
                    <div className="p-3 ml-6 ">#</div>
                    <div className="ml-9">Judul</div>
                    <IoTimeSharp className="ml-[70%]"/>
                </div>
                <AnimatePresence>
                    {
                        state.playlist && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity:0}} transition={{ ease: "easeInOut", duration: .3 }} className="flex flex-row items-end fixed top-3 bg-[#228554] w-[83%] rounded-tl-xl z-10 py-3 gap-3 pl-10">
                                    <img src={props.playlist?.img} alt="song" className="w-10 h-10 shadow-2xl"></img>
                                    <div className="flex flex-col pl-3">
                                        <p className="text-xl">{props.playlist?.name}</p>
                                        <p className="text-sm">{props.playlist?.owner}</p>
                                    </div>
                                </motion.div>
                        )
                    }
                    {
                        state.description && (
                                <motion.div initial={{opacity: 0}} animate={{opacity: .9}} exit={{opacity:0}} transition={{ ease: "easeInOut", duration: .3 }} className="flex fixed z-10 bg-[#165D3A] w-[83%] top-[83px] mb-3 items-center">
                                    <div className="p-3 ml-6 ">#</div>
                                    <div className="ml-9">Judul</div>
                                    <IoTimeSharp className="ml-[70%]"/>
                                </motion.div>
                        )
                    }
                </AnimatePresence>
                {list?.data?.items.map((v, i) => {
                    const name = v.track.name;
                    const img = v.track.album.images[0].url;
                    const artists = v.track.artists.map(v => v.name).join(", ");
                    const class_name = `flex ${i < 9 ? 'ml-[18px]' : 'ml-[10px]'} p-3 gap-3 w-full hover:bg-emerald-700`;
                        return (
                            <div key={v.track.id} className="flex relative items-center ml-5">
                                <p className="p-5">{i+1}</p>
                                <div  onClick={()=> {
                                    handlePlay(token, v.track.uri);
                                }} className={class_name}>
                                    <img src={img} alt="song" className="w-10 h-10"></img>
                                    <div>
                                        <p className="text-base">{name}</p>
                                        <p className="text-xs opacity-50">{artists}</p>
                                    </div>
                                </div>
                            </div>

                        )
                    })}
            </div>

        </div>
    )
}