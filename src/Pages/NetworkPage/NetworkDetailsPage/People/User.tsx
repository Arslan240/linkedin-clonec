import { BsThreeDots } from "react-icons/bs"
import { Portal, ProfileIcon } from "../../../../components"
import { capitalize } from "../../../../utils"
import { AcceptConnectionRequest, GetFollowing,  getUser } from "../../../../firebase/utils"
import { _auth, STATUS_PENDING, STATUS_ACCEPTED, ACC_TYPE_JOB_HOLDER,FIELD_JOB_TITLE } from '../../../../firebase/firebase-config.js'
import { COMPONENT_FOLLOWERS, FOLLOWING } from '../../../FollowersAndFollowing/FollowersAndFollowing.jsx'
import { useState, useEffect, useCallback } from 'react'
import { AiFillMessage, AiOutlineCheck } from "react-icons/ai"
// import { CiNoWaitingSign } from "react-icons/ci"
import { SpinnerCircularFixed } from "spinners-react"
import { usePopper } from "react-popper"

const COMPONENT_CONNECTIONS = "connections"
const breakpoint_size = 440

/** 
 * if component === "COMPONENT_CONNECTIONS".
 *  then userID is from detials otherwise, userID is senderID (for networkPage)
 *  status is already accepted so that's conditional.
 */

interface UserDetails {
    docID?: string;
    userID?: string;
    senderID?: string;
    receiverID?: string;
    status?: string;
    // Add other properties here
}

const User: React.FC<{
    details: UserDetails,
    sent?: string,
    component: string,
    // CONNECTIONS PAGE
    connection_page?: string,
    handleRemoveConnection?: (userID:string) => void
}> = ({ details, component, connection_page, handleRemoveConnection }) => {
    // const {status} = sent || {status: ""};
    // const [status, setSentState] = useState(status)
    let userID;

    // const { docID, senderID, receiverID, status: reqStatus } = details || { docID: "", senderID: "", status: "" }
    const { docID, senderID, status: reqStatus } = details || { docID: "", senderID: "", status: "" }
    const [userDetails, setUserDetails] = useState({ firstName: "", lastName: "", })
    const {firstName, lastName} = userDetails;

    const [user, setUser] = useState();
    const [isAcceptLoading, setIsAcceptLoading] = useState(false);
    // const [isUnfollowLoading, setIsUnfollowLoading] = useState(false);
    const [_firebaseError, setFirebaseError] = useState("")
    const [buttonDetails, setButtonDetails] = useState({})
    const [isfollowing, setIsFollowing] = useState(true); // pass it down to ButtonManager, it tells if you're following that person or not. specifically used in followers page.
    const [status, setStatus] = useState(component === COMPONENT_CONNECTIONS ? STATUS_ACCEPTED : reqStatus);
    const [mobileSize, setMobileSize] = useState(true);

    // CONNECTIONS Page
    const [showConnectionsOptions, setShowConnectionsOptions] = useState(false)
    const [removeConnectionLoading, setRemoveConnectionLoading] = useState(false);
    const [referenceElement, setReferenceElement] = useState();
    const [popperElement, setPopperElement] = useState();
    let { styles, attributes } = usePopper(referenceElement, popperElement, { placement: "bottom-end" });

    const handleRemoveConnectionClick = async () => {
        let { userID: uid } = details;
        try {
            await handleRemoveConnection?.(uid)
        } catch (error) {
            throw error;
        }
        finally{
            setRemoveConnectionLoading?.(false);
        }
    }


    if (component === COMPONENT_CONNECTIONS || component === COMPONENT_FOLLOWERS) {
        let { userID: tempUserID } = details;
        userID = tempUserID;
    }
    else {
        userID = senderID;
    }

    useEffect(() => {
        let message = "";
        let icon;
        switch (status) {
            case STATUS_PENDING:
                // message = "Accept";
                icon = <AiOutlineCheck size={18} />
                break;
            case STATUS_ACCEPTED:
                // message = "Message";
                icon = <AiFillMessage size={18} />;
                break;
            // case STATUS_REJECTED:
            // break;
            // default:
            //     message = "Connect";
            //     icon = <BsPlusCircle size={18}/>
        }
        setButtonDetails({ message, icon })
    }, [status])
    // const [iconSize, setIconSize] = useState(small_icon);

    // handle Messages
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= breakpoint_size) {
                status === STATUS_ACCEPTED ?
                    setButtonDetails({ message: "Message", icon: buttonDetails["icon"] })
                    : status === STATUS_PENDING ?
                        setButtonDetails({ message: "Pending", icon: buttonDetails["icon"] }) : undefined

                setMobileSize(false)
                // setIconSize(large_icon);
            } else {
                setMobileSize(true)
                // setIconSize(small_icon);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    })

    // fetching sender's details
    useEffect(() => {
        async function fetchUser() {
            const user = await getUser(userID);
            const userData = user.data();
            setUser(userData);

            const { firstName, lastName, accountType } = userData;
            let descTitle;

            if (accountType === ACC_TYPE_JOB_HOLDER) {
                descTitle = userData[FIELD_JOB_TITLE]
            }
            // @ts-ignore
            setUserDetails({ firstName, lastName, descTitle });
        }
        fetchUser();
    }, [userID])



    const handleAccept = async () => {
        setIsAcceptLoading(true);
        try {
            await AcceptConnectionRequest(senderID, docID)
            setStatus(STATUS_ACCEPTED);
        } catch (error) {
            // @ts-ignore
            setFirebaseError({ message: error?.message, code: error?.code })
        }
        setIsAcceptLoading(false);
    }



    const handleIgnore = () => {

    }

    const handleMessage = () => {
    }

    const handleFollow = useCallback(async () => {
    }, [])

    const handleUnfollow = useCallback(() => {
        setIsAcceptLoading(true);
        setTimeout(() => {
            setIsAcceptLoading(false)
        }, 500)
    }, [])

    return (
        <div className="network__results__actual__user">
            <div className="network__results__actual__user__container">
                <ProfileIcon height={50} name={`${firstName} ${lastName}`} imageURL=""/>
                <div className="network__results__user__details">
                    <p className="network__results__user__title">{`${capitalize(userDetails?.firstName)} ${capitalize(userDetails?.lastName)}`}</p>
                    {/* @ts-ignore */}
                    <span className="network__results__user__desc margin__nt">{userDetails?.descTitle}</span>
                    {/* @ts-ignore */}
                    <span className="network__results__user__desc margin__nt">{user?.headline}</span>
                    {/* <span className="network__results__time margin__nt">2d</span> */}
                </div>
            </div>
            <div className="network__page__results__actions">
                {component !== COMPONENT_CONNECTIONS && component !== COMPONENT_FOLLOWERS && (
                    <div className={`network__page__results__action ignore__action`} onClick={handleIgnore}>
                        <div className="connect__message" >
                            <span>Ignore</span>
                        </div>
                    </div>
                )}

                <div
                    className={`network__page__results__action`}
                    style={{ "border": `${isAcceptLoading ? "none" : "1px solid var(--linkedin-blue)"}` }}
                    onClick={
                        component === COMPONENT_FOLLOWERS
                            ? connection_page === FOLLOWING ? handleUnfollow
                                : isfollowing ? handleUnfollow : handleFollow
                            : status === STATUS_ACCEPTED ? handleMessage : handleAccept}
                >
                    <div className="connect__message">
                        {isAcceptLoading ? (
                            <SpinnerCircularFixed color="var(--linkedin-blue)" size={20} />
                        ) : (
                            <>
                                {component === COMPONENT_FOLLOWERS ? <FollowerManger connectionPage={connection_page} setIsFollowing={setIsFollowing} userID={userID} /> : (
                                    <>
                                        {!mobileSize && <span>{buttonDetails["message"]}</span>}
                                        {buttonDetails["icon"]}
                                    </>
                                )}

                            </>
                        )}
                    </div>
                </div>
                {/* TODO: Add React Modal for remove connection option */}
                {component === COMPONENT_CONNECTIONS &&
                    <div
                        key={details.userID}
                        className="network__page__results__options"
                        // @ts-ignore
                        ref={setReferenceElement}
                        onClick={() => setShowConnectionsOptions?.(!showConnectionsOptions)}
                    >
                        <div className="network__page__three__dots">
                            <BsThreeDots size={20} />
                        </div>
                    </div>
                }

            </div>
            <Portal idName="">
                <div
                    className={`connections__page__remove__options ${showConnectionsOptions ? "display" : "display_none"}`}
                    // @ts-ignore
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}

                >
                    <div
                        className="connections__page__remove__connection"
                        onClick={handleRemoveConnectionClick}
                    >
                        <span>Remove Connection</span>
                        <span>
                            {removeConnectionLoading
                                ? (<SpinnerCircularFixed size={25} color="var(--linkedin-blue)" />)
                                : ""}
                        </span>
                    </div>
                </div>
            </Portal>
        </div>
    )
}
export default User


const FollowerManger = ({ connectionPage, userID, setIsFollowing }) => {
    const [followingDet, setFollowingDet] = useState(false);

    useEffect(() => {
        async function decideFollowing() {
            try {
                const followingFetch: [] | null = await GetFollowing();

                if (followingFetch === null) {
                    setFollowingDet(false);
                    setIsFollowing(false);
                } else {
                    const res = followingFetch.find(({ searchTerms }) => searchTerms[1] === userID)
                    if (!res) {
                        setIsFollowing(true);
                    } else {
                        setIsFollowing(false);
                    }
                }

            } catch (error) {
            }
        }
        decideFollowing();
    }, [])

    useEffect(() => {
        if (followingDet) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }
    }, [followingDet])

    // if connectionPage is following then button will always say unfollow, if it is followers page, then we check if logged in user is also following that user or not. 
    return connectionPage === FOLLOWING ? "Unfollow" : followingDet ? "Unfollow" : "Follow"

}