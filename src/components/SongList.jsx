import { useEffect, useState, useContext } from "react"
import fetchPlaylistItems from "../utils/fetchPlaylistItems"
import { TokenContext } from "../App";
import fetchPlayer from "../utils/fetchPlayer";

export default function SongList(props){
    const token = useContext(TokenContext);
    const [list, setList] = useState({});
    const handlePlay = async (token, track) => {
        await fetchPlayer(token, track).catch(err => console.log(err));
    }
    useEffect(() => {
        const callData = async () => {
            if (token) {
                const response = await fetchPlaylistItems(token, props.list_song ? props.list_song : process.env.REACT_APP_PLAYLIST_ID);
                setList(response);
            }
        }
        callData();
    }, [token, props?.list_song]);

    return (
        <div className="flex flex-col bg-zinc-800 w-full pt-3 ml-5 h-[65vh] overflow-y-auto text-white rounded-xl">
            {list?.data?.items.map((v) => {
                const name = v.track.name;
                const img = v.track.album.images[0].url;
                const artists = v.track.artists.map(v => v.name).join(", ");
                    return (
                        <div key={v.track.id} onClick={()=> {
                                props.sendDataToParent({name, img, artists });
                                handlePlay(token, v.track.uri);
                            }} className="flex ml-3 p-3 gap-3 hover:bg-zinc-700">
                            <img src={img} alt="song" className="w-10 h-10"></img>
                            <div>
                                <p className="text-base">{name}</p>
                                <p className="text-xs">{artists}</p>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}