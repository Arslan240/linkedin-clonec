import "./FollowersAndFollowing.css"
import { LoggedInPage } from "../../components/"
import { useEffect, useState } from "react"
import User from "../NetworkPage/NetworkDetailsPage/People/User"
import { GetFollowers, GetFollowing } from "../../firebase/utils"
import { SpinnerCircularFixed } from "spinners-react"
import { auth } from "../../firebase/firebase-config"

export const FOLLOWERS = "followers"
export const FOLLOWING = "following"
export const COMPONENT_FOLLOWERS = "followers_component"

const FollowersAndFollowing = () => {
    const [currentPage, setCurrentPage] = useState(FOLLOWING)

    return (
        <LoggedInPage>
            <div className="follow__page__left">
                <div className="follow__page__title f__section"><span>{auth.currentUser.email} Network</span></div>
                <div className="follow__page__options f__section">
                    <div
                        className={`follow__page__option f__op__following ${currentPage === FOLLOWING ? 'active' : ''}`}
                        onClick={() => setCurrentPage(FOLLOWING)}
                    >
                        <span>Following</span>
                    </div>
                    <div
                        className={`follow__page__option f__op__followers ${currentPage === FOLLOWERS ? 'active' : ''}`}
                        onClick={() => setCurrentPage(FOLLOWERS)}
                    >
                        <span>Followers</span>
                    </div>
                </div>
                <UserRenderer currentPage={currentPage} />

            </div>
        </LoggedInPage>
    )
}
export default FollowersAndFollowing


const UserRenderer = ({ currentPage }) => {
    const [followersState, setFollowersState] = useState([])
    const [usersState, setUsersState] = useState([])
    const [nullMessage, setNullMessage] = useState("");
    const [loadingState, setLoadingState] = useState(true);
    const followMessage = currentPage === FOLLOWING ? "" : ""

    useEffect(() => {
        async function fetchConnections() {
            setLoadingState(true);
            switch (currentPage) {
                case FOLLOWERS:
                    const followers = await GetFollowers()
                    setFollowersState(followers)
                    if (followers === null) {
                        setNullMessage(`No Followers of ${auth.currentUser.email}`)
                    }
                    setLoadingState(false);
                    return;
                case FOLLOWING:
                    const following = await GetFollowing()
                    setFollowersState(following)
                    if (following === null) {
                        setNullMessage(`You are not following anyone`)
                    }
                    setLoadingState(false);
                    return;
                default:
                    break;
            }
            setLoadingState(false);
        }
        fetchConnections();
    }, [currentPage])

    useEffect(() => {
        function fetchUserIDs() {
            if (followersState === null) {
                setUsersState(null);
            }
            else if (followersState?.length > 0) {
                const ids = followersState.map((state) => {
                    let uID;
                    if (currentPage === FOLLOWERS) {
                        uID = state.followerID;
                    } else {
                        uID = state.userID;
                    }
                    return uID;
                })
                setUsersState(ids)
            }
        }
        fetchUserIDs()
    }, [followersState])

    return (
        <div className="follow__page__users">
            {
                // usersState === null ? <div className="follow__page__null__message">
                //     {nullMessage}
                // </div> : 
                loadingState ? (
                    <div style={{display:"flex", justifyContent: 'center', alignItems: 'center', paddingBlock: '.5rem'}}>
                        <SpinnerCircularFixed color="var(--linkedin-blue)" size={30} />
                    </div>
                ) : (
                    <>
                        {usersState === null ? <div className="follow__page__null__message">
                            {nullMessage}
                        </div> : ( usersState.length > 0 ? (
                            <>
                                <div className="follow__page__stats">
                                    {currentPage === FOLLOWING ? (
                                        <span>You are following {followersState?.length} {followersState?.length === 1 ? "person" : "people"} out of your network.</span>
                                        ) : (
                                        <span>You have {followersState?.length} {followersState?.length === 1 ? "follower" : "followers"}.</span>
                                    )}
                                </div>
                                { usersState.map((userID) => {
                                    return <User component={COMPONENT_FOLLOWERS} details={{ userID }} connection_page={currentPage} />
                                })}
                            </>
                        ) : (
                            <></>
                        )
                        )}
                    </>
                )}
            { }
        </div>
    )
}