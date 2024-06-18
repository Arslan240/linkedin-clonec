import { ProfileIcon } from "../../../../components"
import "./Post.css"
import { BsThreeDots } from 'react-icons/bs'
import { IoCloseOutline } from 'react-icons/io5'
import { FaRegCommentDots } from 'react-icons/fa'
import { MdRepeat } from 'react-icons/md'
import { RiSendPlaneFill } from 'react-icons/ri'
import { BiLike, BiSolidLike } from "react-icons/bi"
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { useLocation } from 'react-router-dom'
import { auth, MEDIA_TYPE_IMAGES, MEDIA_TYPE_DOC, MEDIA_TYPE_VIDEO } from '../../../../firebase/firebase-config.js'
import { useComments } from '../../../../Context/CommentContext.jsx'
import { FLAG_REPLY } from '../../../../Context/CommentContext.jsx'

// DocViewer
// import DocViewer, { DocViewerRenderers,PDFRenderer } from "@cyntler/react-doc-viewer";
// import DocViewer from "@cyntler/react-doc-viewer";

const large_icon = 25;

// type ComponentProps = {
//     component: "HomePage" | "PostPage"
// }
type PostProps = {
    postID: string,
    userID: string,
    component: "HomePage" | "PostPage",
    postDesc: string,
    mediaType: string,
    mediaURL?: string,
    likes?: string[],
}

const Post: React.FC<PostProps> = ({ postID, userID, component = "HomePage", postDesc, mediaType, mediaURL, likes = [] }) => {
    const [likesState, setLikesState] = useState(likes);
    const [like, setLike] = useState(likesState.length <= 0 ? null : !!likesState.find((uID) => uID === auth.currentUser.uid));
    const [postUser, setPostUser] = useState({});
    // @ts-ignore
    const {firstName, lastName} = postUser;

    // const [commonentAddedSuccessfully, setCommonentAddedSuccessfully] = useState(false);
    // const [likeAddedSuccessfully, setLikeAddedSuccessfully] = useState(false);
    
    const initialRenderRef = useRef(true);
    const { commentsLength, isLoading } = useComments()

    // function currentPathMatchesPostUrl() {
    //     const location = useLocation();
    //     const postUrlPattern = `/in/${userID}/activity/post/${postID}`;
    //     return location.pathname.startsWith(postUrlPattern);
    // }

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            return;
        }

        let debounceTimeout;
        try {
            if (like !== null) {
                debounceTimeout = setTimeout(async () => {
                    const updatedLikes = await LikeAPost(like, postID)
                    setLikesState(updatedLikes);
                }, 300)
            }
        } catch (error) {
            throw error;
        }

        return () => clearTimeout(debounceTimeout);
    }, [like])

    useEffect(() => {
        async function fetchPostUser(uID) {
            try {
                const result = await getUser(uID);
                if(result !== null){
                    const data = result.data(); 
                    setPostUser(data);
                }
            } catch (error) {
                throw error;
            }
        } 
        fetchPostUser(userID);
    },[])



    // useEffect(() => {   
    //     // TODO: do fetching of post data inside this fetch loop.
    // },[likeAddedSuccessfully, commonentAddedSuccessfully])

    return (
        <div className="post">
            {/* {component === "HomePage" ? (
                <>
                    <div className="post__related__person">
                        <div className="related__person__container">
                            <ProfileIcon height={large_icon} />
                            <span className="related__person__name">Talha Nasir&nbsp;</span><span className="text__light">likes this</span>
                        </div>
                        <PostActionsRemove component="HomePage" />
                    </div>
                    <div className="post__linebreak break-first" />
                </>

            ) : (
                <></>
            )} */}

            <div className="post__actual__user__remove__actions">
                {/* TODO: Add a link on user name to redirect to profile page */}
                <Link to={`/in/${userID}`} className="post__page__link">
                    <div className="post__actual__user">
                        <ProfileIcon height={50} name={`${firstName} ${lastName}`} imageURL=""/>
                        <div className="post__user__details">
                            <p>{`${capitalize(firstName)} ${capitalize(lastName)}`}</p>
                            {/* @ts-ignore */}
                            <span className="post__user__desc margin__nt">{postUser?.headline}</span>
                            {/* <span className="post__time margin__nt">2d</span> */}
                        </div>
                    </div>
                </Link>
                <PostActionsRemove component={component} />
            </div>
            <Link 
                to={`/in/${userID}/activity/post/${postID}`}
                className="post__page__link">
                <div className="post__text__body">{postDesc}
                </div>
            </Link>

            <div className="post__media">
                {
                    mediaType === MEDIA_TYPE_IMAGES ? (
                        <img className='post__image__view' src={mediaURL} alt="Uploaded Image" />
                    ) : mediaType === MEDIA_TYPE_DOC ? (
                        // <DocViewer 
                        //     documents={[{uri: mediaURL}]} 
                        //     config={{
                        //         header: {
                        //             disableFileName: true,
                        //             disableHeader: true,
                        //         },
                        //     }}
                        // />

                        <embed
                            src={mediaURL}
                            type="application/pdf"
                            width="100%"
                            height="300"
                            className="post__media__pdf__viewer"

                        />
                    ) : mediaType === MEDIA_TYPE_VIDEO ? (
                        <video controls width="100%" height="300">
                            <source src={mediaURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <></>
                    )
                }
            </div>
            {/* TODO: conditional if comments exist then show comments, if likes exists then show likes, if none exists then whole div is not shown. */}
            <PostReactions commentsLength={commentsLength} likes={likesState} />

            <div className="post__linebreak" />
            <div className="post__media__actions">
                <div className="media__action" onClick={() => setLike(!like)}>
                    {like
                        ? <BiSolidLike className="media__action__icon" size={large_icon} color="var(--linkedin-blue)" />
                        : <BiLike className="media__action__icon" size={large_icon} />
                    }
                    <span className="media__action__text">Like</span>
                </div>
                <Link
                    // to={currentPathMatchesPostUrl() ? "" : `/in/${userID}/activity/post/${postID}`}
                    to={""}
                    className="media__action">
                    <FaRegCommentDots className="media__action__icon" size={large_icon} />
                    <span className="media__action__text">Comment</span>
                </Link>
                <div className="media__action">
                    <MdRepeat className="media__action__icon" size={large_icon} />
                    <span className="media__action__text">Repost</span>
                </div>
                <div className="media__action">
                    <RiSendPlaneFill className="media__action__icon" size={large_icon} />
                    <span className="media__action__text">Send</span>
                </div>
            </div>
            <AddComment component="PostPage" postID={postID} isLoading={isLoading}/>
            <CommentContainer postID={postID} userID={userID} />
        </div>
        // </CommentContextProvider>
    )
}
export default Post


type PostActionsRemove = {
    component: "HomePage" | "PostPage"
}
const PostActionsRemove: React.FC<PostActionsRemove> = ({ }) => {
    return (
        <div className="post__actions__remove">
            <BsThreeDots className="actions_remove_icon" size={large_icon} />
            <IoCloseOutline className="actions_remove_icon" size={large_icon} />
        </div>
    )
}

const icon_size = 17
const like_icon_color = "var(--linkedin-blue)"
const PostReactions = ({ commentsLength, likes }) => {

    if (commentsLength > 0 && likes.length > 0) { //render both comments and likes 
        return (
            <div className="post__reaction_details">
                <div className="reactions">
                    <BiSolidLike size={icon_size} color={like_icon_color} className="post__icon__like" />
                    <span>{likes.length} likes</span>
                </div>
                <div className="comments">
                    <span>{commentsLength} comments</span>
                </div>
            </div>
        );
    } else if (commentsLength <= 0 && likes.length > 0) { // only render likes
        return (
            <div className="post__reaction_details">
                <div className="reactions">
                    <BiSolidLike size={icon_size} color={like_icon_color} className="post__icon__like" />
                    <span>{likes.length} likes</span>
                </div>
            </div>
        );
    } else if (commentsLength > 0 && likes.length <= 0) { //only render comments
        return (
            <div className="post__reaction_details">
                <div className="comments">
                    <span>{commentsLength} comments</span>
                </div>
            </div>
        );
    } else {
        return null; // Render nothing when both comments and likes are not present
    }

    // return commentsLength > 0 && likes.length > 0 ? (
    //     <div className="post__reaction_details">
    //         <div className="reactions">
    //             <BiSolidLike size={icon_size} color={like_icon_color} className="post__icon__like" />
    //             <span>{likes.length} likes</span>
    //         </div>
    //         <div className="comments">
    //             <span>{commentsLength} comments</span>
    //         </div>
    //     </div>
    // ) : commentsLength <= 0 && likes.length <= 0 ? (
    //     ""
    // )
    // : commentsLength <= 0 ? (
    //     <div className="post__reaction_details">
    //         <div className="reactions">
    //             <BiSolidLike size={icon_size} color={like_icon_color} className="post__icon__like" />
    //             <span>{likes.length} likes</span>
    //         </div>
    //     </div>
    // ) : likes.length <= 0 ? (
    //     <div className="post__reaction_details">
    //         <div className="comments">
    //             <span>{commentsLength} comments</span>
    //         </div>
    //     </div>
    // ) : ""
}


// import EmojiPicker from 'emoji-picker-react';
import { GrEmoji } from "react-icons/gr"
// import CommentPortal from "./CommentPortal"
import { LikeAPost, getUser } from "../../../../firebase/utils"
// import { Document, Page } from "react-pdf"
import { SpinnerCircularFixed } from "spinners-react"
import { capitalize } from "../../../../utils/index.js"
import {useAuth} from '../../../../Context/AuthContext.jsx'


const icon_size_small_profile = 30;
const icon_size_large_profile = 36;

type AddCommentProps = {
    component: "HomePage" | "PostPage",
    flag?: FLAG_REPLY | null,
    commID?: string | null,
    postID: string | null,
    isLoading?: boolean,
}

const AddComment: React.FC<AddCommentProps> = ({ component, flag = null, commID = null, postID = null, isLoading = false }) => {
    const {userData} = useAuth()
    const {firstName, lastName} = userData;

    const commentInputRef = useRef()
    // const emojiRef = useRef<HTMLElement | null>(null);
    const [referenceElement, _setReferenceElement] = useState<HTMLElement | null>(null);
    const [open, setOpen] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);
    const [commentValue, setCommentValue] = useState("")
    const [profileIconSize, setProfileIconSize] = useState(icon_size_small_profile)
    const { handleCommentSubmit } = useComments();

    // const handleEmojiClick = (emojiObject) => {
    //     setCommentValue(commentValue + emojiObject.emoji)
    //     // @ts-ignore
    //     commentInputRef.current.focus();
    // }
    // when the component loads
    useEffect(() => {
        if (flag === FLAG_REPLY) {
            // @ts-ignore
            if (commentInputRef?.current) commentInputRef.current.focus();
        } else {
            setProfileIconSize(icon_size_large_profile)
        }
    })

    const handleCommAddFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleCommentSubmit(commentValue, postID, commID, flag);
            if (!isLoading) {
                setCommentValue("");
                setInputFocus(false);
            }
        } catch (error) {

        }
    }


    return component === "PostPage" ? (
        <div className="post__page__write__comment">
            <div className="write__comment__container">
                <ProfileIcon height={profileIconSize} name={`${firstName} ${lastName}`} imageURL=""/>
                <div className={`post__page__write__comment__input__container ${inputFocus ? "focused" : ""}`}>
                    <form onSubmit={handleCommAddFormSubmit} className="write__comment__form">
                        <input className="write__comment__input" type="text"
                            ref={commentInputRef}
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            onFocus={() => setInputFocus(true)}
                            onBlur={() => setInputFocus(false)}
                        />
                    </form>
                    <GrEmoji size={27} className="write__comment__emoji__opener" ref={referenceElement}
                        onClick={open ? () => {} : () => setOpen(!open)}
                    />
                </div>
            </div>
            {/* <CommentPortal handleEmojiClick={handleEmojiClick} open={open} setOpen={setOpen} referenceElement={referenceElement} elementRef={emojiRef} /> */}
            {commentValue !== "" ?
                <button className={`btn__post__comment`} onClick={handleCommAddFormSubmit}>
                    {isLoading ? <SpinnerCircularFixed size={20} color="white" /> : "Post"}
                </button> : ""
            }
        </div>
    ) : ""
}

// create a comment container
// get comments for this post
// iterate over them recursively
// Create a new Component CommentThread, Comment.
// also get photoURLs for users to show their profile pics.
// If profileDesc none in each user then show nothing for now.


const CommentContainer = ({ postID, userID: _userID }) => {

    const { comments, isReplyCommentShown } = useComments();
    const { state, commID } = isReplyCommentShown;

    // const [isReply, setIsReply] = useState(false);
    // const [replyValue, setReplyValue] = useState("");
    return (
        <div className="post__page__comments__container">
            {comments.map((comment) => (
                <CommentThread comment={comment} />
            ))}
            {state ? (<AddComment component="PostPage" commID={commID} flag={FLAG_REPLY} postID={postID} />) : null}
        </div>
    )
}

const CommentThread = ({ comment, ml = 0 }) => {
    // const { setIsReplyCommentShown } = useComments();

    return (
        <div className="post__page__comments__thread" style={{ marginLeft: ml }}>
            <Comment comment={comment} key={comment.docID} />

            {comment?.replies && comment?.replies.map((reply) => (
                reply !== "" && <CommentThread comment={reply} ml={ml + 30}/>
            ))}

        </div>
    )
}

const Comment = ({ comment }) => {
    const { userID, body, docID } = comment;
    const { setIsReplyCommentShown } = useComments()
    const [userData, setUserData] = useState({firstName: "", lastName: "", headline: ""})
    const {firstName,headline,lastName} = userData;

    const handleShowReplyBox = () => {
        setIsReplyCommentShown((prev) => {
            if (prev.commID === docID) {
                return { ...prev, state: !prev.state }
            }
            else if (prev.commID !== docID) {
                return { state: true, commID: docID }
            }
        })
    }

    useEffect(() => {
        async function fetchUser(){
            try {
                const result = await getUser(userID);
                if(!result) {
                    // @ts-ignore
                    const {firstName, lastName, headline} = result.data();
                    setUserData({firstName, lastName,headline})
                }
            } catch (error) {
                throw error;
            }
        }
        fetchUser();
    },[userID])

    return (
        <div className="post__page__single__comment">
            <ProfileIcon height={icon_size_small_profile} name={`${firstName} ${lastName}`}/>
            <div className="comment__body__container">
                <div className="comment__user__details">
                    <span className="comment__user__name">{`${capitalize(firstName)} ${capitalize(lastName)}`}</span>
                    <p className="comment__user__description">{headline}</p>
                </div>
                <span>{body ? body : docID}</span>
                <span onClick={handleShowReplyBox} className="comment__reply__button">Reply</span>
            </div>
        </div>
    )
}

