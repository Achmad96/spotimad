import Playlist from "../components/Playlist";
import UserProfile from "../components/UserProfile";

export default function LeftLayout({ playlist_state }) {
    return (
        <aside className="flex flex-col ml-1 mt-3 mb-2 gap-2">
            <UserProfile />
            <Playlist playlist_state={playlist_state} />
        </aside>
    );
}
