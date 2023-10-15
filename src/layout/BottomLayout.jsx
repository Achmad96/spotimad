import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { BsSkipStartFill, BsFillSkipEndFill } from "react-icons/bs";
import { useEffect, useState, useContext } from "react";
import { Token } from "../App";
import fetchHandler from "../utils/fetchHandler";

export default function BottomLayout() {
    const token = useContext(Token);
    const [isPlaying, setPlaying] = useState();
    const [songObject, setSongObject] = useState();
    const handlePrevAndNext = async (type) => {
        return await fetchHandler(token, `/v1/me/player/${type}`, "post").then(() =>
            setPlaying(true)
        );
    };
    const handlePlaySong = async () => {
        const device_id = "16bd04e11348489421f2cd765d3b07b70fa8ecfb";
        const context_uri = "spotify:playlist:6AGdPxT2tGSKcbSGhGaylj";
        if (isPlaying) {
            setPlaying(false);
            return await fetchHandler(token, `/v1/me/player/pause?device_id=${device_id}`, "put");
        }
        return await fetchHandler(token, `/v1/me/player/play?device_id=${device_id}`, "put", {
            body: {
                context_uri,
                offset: {
                    position: 0,
                },
                position_ms: 0,
            },
        })
            .then(() => setPlaying(true))
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const callData = async () => {
            if (token !== undefined) {
                const res = await fetchHandler(token, "/v1/me/player/currently-playing");
                const res2 = await fetchHandler(token, "/v1/me/player/queue");
                if (res.data.is_playing) {
                    setPlaying(true);
                }
                setSongObject(res2.data.currently_playing);
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
