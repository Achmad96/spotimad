import { useEffect, useState, useContext } from "react";
import profileImg from "../assets/profile.jpg"
import fetchUser from "../utils/fetchUser";
import { TokenContext } from "../App";

export default function UserProfile() {
    const [profile, setProfile] = useState({});
    const token = useContext(TokenContext);
    useEffect(() => {
        const callData = async() => {
            if (token !== undefined) {
                const response = await fetchUser(token);
                setProfile(response.data);
            }
        }
        callData();
    }, [token])
    
    return (
        <div className="flex bg-zinc-800 w-60 h-[13vh] p-5 text-white rounded-xl gap-5">
            <img src={profileImg} alt="user-profile" className="w-12 h-12 rounded-[50%]"></img>
            <div>
                <p className="text-lg">{profile?.display_name}</p>
                <p className="text-xs text-teal-400"><span className="text-teal-200">Followers:</span> {profile?.followers?.total}</p>
            </div>
        </div>
    )
}