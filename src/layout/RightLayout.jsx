import { useState } from "react";
import SongList from "../components/SongList";
export default function RightLayout(props){
    const [selectedSong, setSelectedSong] = useState({});
    return (
        <aside className="flex flex-col w-[80%] gap-5">
            <div className="flex flex-row bg-zinc-800 w-full ml-5 mt-3 min-h-[13vh] text-white rounded-xl">
                {selectedSong.name && (
                    <div className="flex flex-row items-center gap-5">
                        <img src={selectedSong?.img} alt="song" className="ml-10 w-14 h-14"></img>
                        <div>
                            <p className="text-xl font-bold">{selectedSong?.name}</p>
                            <p className="text-sm">{selectedSong?.artists}</p>
                        </div>
                    </div>
                )}
            </div>
            <SongList sendDataToParent={setSelectedSong} list_song={props.list_song}/>
        </aside>
    );
}