import { useState , useEffect, useContext } from "react";
import fetchPlaylist from "../utils/fetchPlaylist"
import { TokenContext } from "../App";
export default function Playlist(props) {
    const [playlist, setPlaylist] = useState({});
    const token = useContext(TokenContext);
    useEffect(() => { 
        const callData = async () => {
            if (token !== undefined) {
                const response = await fetchPlaylist(token);
                setPlaylist(response.data);
            }
        }
        callData(); 
    }, [token])

    return (
        <div className="flex flex-col bg-zinc-800 w-60 h-[65vh] overflow-y-auto p-5 text-white rounded-xl gap-2">
            {
                playlist?.items?.map((v, i) => {
                    return (
                        <div key={v.id} className="flex gap-3 hover:bg-zinc-700 w-full p-5" onClick={() => props.setSelectedSongList(v.id)}>
                            <img src={v.images[i].url} alt="playlist" className="w-20 h-20 rounded-xl"></img>
                            <div>
                                <p className="text-lg">{v.name}</p>
                                <p className="text-sm text-opacity-75">{v.tracks.total} songs</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}