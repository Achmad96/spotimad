import Playlist from "../components/Playlist";
import UserProfile from "../components/UserProfile";

export default function LeftLayout(props) {
    return (
        <aside className="flex flex-col ml-3 mt-3 gap-5">
            <UserProfile/>
            <Playlist setSelectedSongList={props.setSelectedSongList}/>
        </aside>
    )
}