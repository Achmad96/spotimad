import { FaPlayCircle } from "react-icons/fa"
import { BsFillSkipBackwardFill, BsFillSkipForwardFill, BsSkipStartFill, BsFillSkipEndFill} from "react-icons/bs"
import fetchPlayer from "../utils/fetchPlayer";

export default function BottomLayout(props){
    const handlePlaySong = async (token) => {
        await fetchPlayer(token, "spotify:track:5g1BARk25uUJtEPSUwcjnU").catch(error => console.log(error));
    }

    return (
        <footer className="flex items-center justify-center bg-zinc-800 w-[100%] h-[13vh] text-white gap-5">
            <BsFillSkipBackwardFill className="w-7 h-7"/>
            <BsSkipStartFill className="w-7 h-7"/>
            <FaPlayCircle className="w-8 h-8" onClick={() => handlePlaySong(props.token)}/>
            <BsFillSkipEndFill className="w-7 h-7"/>
            <BsFillSkipForwardFill className="w-7 h-7"/>
        </footer>
    );
}