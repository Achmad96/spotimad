import { useEffect, useState, useContext } from "react";
import profileImg from "../assets/profile.jpg";
import { Token } from "../App";
import fetchHandler from "../utils/fetchHandler";

export default function UserProfile() {
    const [profile, setProfile] = useState({});
    const token = useContext(Token);
    useEffect(() => {
        const callData = async () => {
            if (token !== undefined) {
                const response = await fetchHandler(
                    token,
                    `/v1/users/${process.env.REACT_APP_USER_ID}`,
                    "get"
                );
                setProfile(response.data);
            }
        };
        callData();
    }, [token]);

    return (
        <div className="flex bg-[#121212] w-60 h-[15vh] p-5 shadow-2xl text-white rounded-xl gap-5">
            <img src={profileImg} alt="user-profile" className="w-12 h-12 rounded-[50%]"></img>
            <div>
                <p className="text-lg">{profile?.display_name}</p>
                <p className="text-xs opacity-70">{profile?.followers?.total} pengikut</p>
            </div>
        </div>
    );
}
