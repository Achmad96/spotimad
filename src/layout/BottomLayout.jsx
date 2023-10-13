import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { BsSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
import fetchPlayer from "../utils/fetchPlayer";
import { useEffect, useState } from "react";
import fetchPause from "../utils/fetchPause";
import fetchCurrentlyPlaying from "../utils/fetchCurrentlyPlaying";
import fetchPrevAndNext from "../utils/fetchPrevAndNext";
import fetchUserQueue from "../utils/fetchUserQueue";

export default function BottomLayout(props) {
    const { token } = props;
    const [isPlaying, setPlaying] = useState();
    const [songObject, setSongObject] = useState();
    const handlePrevAndNext = async (type) => {
        return await fetchPrevAndNext(token, type).then(() => setPlaying(true));
    };
    const handlePlaySong = async () => {
        if (isPlaying) {
            setPlaying(false);
            return await fetchPause(token, "16bd04e11348489421f2cd765d3b07b70fa8ecfb");
        }
        return await fetchPlayer(token, "16bd04e11348489421f2cd765d3b07b70fa8ecfb")
            .then(() => setPlaying(true))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const callData = async () => {
            if (token) {
                const response = await fetchCurrentlyPlaying(token);
                const response_songObject = await fetchUserQueue(token);
                if (response.data.is_playing) {
                    setPlaying(true);
                }
                setSongObject(response_songObject.data.currently_playing);
            }
        };
        callData();
    }, [token, songObject]);

    return (
        <footer className="flex items-center justify-between z-10 bg-[#121212] w-[100%] h-[15vh] text-white gap-5">
            <div className="ml-5">
                {songObject?.album && (
                    <div className="flex gap-1">
                        <img
                            src={songObject?.album.images[0].url}
                            alt="seletced_song"
                            className="z-10 rounded-xl w-16 h-16"
                        ></img>
                        <div className="ml-3 mb-3 flex justify-end flex-col">
                            <p className="text-sm">{songObject?.name}</p>
                            <p className="text-xs">
                                {songObject?.artists.map((v) => v.name).join(", ")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-5">
                <BsSkipStartFill
                    className="w-7 h-7 opacity-70 hover:opacity-100"
                    onClick={() => handlePrevAndNext("previous")}
                />
                {isPlaying ? (
                    <FaPauseCircle
                        className="w-8 h-8 opacity-70 hover:opacity-100"
                        onClick={handlePlaySong}
                    />
                ) : (
                    <FaPlayCircle
                        className="w-8 h-8 opacity-70 hover:opacity-100"
                        onClick={handlePlaySong}
                    />
                )}
                <BsFillSkipEndFill
                    className="w-7 h-7 opacity-70 hover:opacity-100"
                    onClick={() => handlePrevAndNext("next")}
                />
            </div>
            <input type="range" className="h-7 mr-10" defaultValue={50}></input>
        </footer>
    );
}
