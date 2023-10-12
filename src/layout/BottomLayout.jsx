import { FaPlayCircle } from "react-icons/fa";
import {
    BsFillSkipBackwardFill,
    BsFillSkipForwardFill,
    BsSkipStartFill,
    BsFillSkipEndFill,
} from "react-icons/bs";
import fetchPlayer from "../utils/fetchPlayer";
import { useRef } from "react";

export default function BottomLayout(props) {
    const { volumeState, selectedSongState } = props;
    const [, setVolume] = volumeState;
    const [selectedSong] = selectedSongState;
    const handlePlaySong = async (token) => {
        await fetchPlayer(token, "spotify:track:5g1BARk25uUJtEPSUwcjnU").catch((error) =>
            console.log(error)
        );
    };

    const audioVolume = useRef(null);
    const handleVolume = (e) => {
        setVolume(e.target.value / 100);
    };

    return (
        <footer className="flex items-center justify-between z-10 bg-[#121212] w-[100%] h-[15vh] text-white gap-5">
            <div className="ml-5">
                {selectedSong?.img && (
                    <div className="flex gap-1">
                        <img src={selectedSong?.img} className="z-10 rounded-xl w-16 h-16"></img>
                        <div className="ml-3 mb-3 flex justify-end flex-col">
                            <p className="text-sm">{selectedSong?.name}</p>
                            <p className="text-xs">{selectedSong?.artists}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-5">
                <BsFillSkipBackwardFill className="w-7 h-7" />
                <BsSkipStartFill className="w-7 h-7" />
                <FaPlayCircle className="w-8 h-8" onClick={() => handlePlaySong(props.token)} />
                <BsFillSkipEndFill className="w-7 h-7" />
                <BsFillSkipForwardFill className="w-7 h-7" />
            </div>
            <input
                ref={audioVolume}
                type="range"
                className="h-7 mr-10"
                defaultValue={50}
                onChange={handleVolume}
            ></input>
        </footer>
    );
}
