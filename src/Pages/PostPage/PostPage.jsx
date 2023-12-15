import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { LoggedInPage, ProfileIcon } from "../../components"
import { Post } from '../'
import "./PostPage.css"
import { auth } from "../../firebase/firebase-config"
import { useEffect, useState } from "react"
import { GetPost } from "../../firebase/utils/PostUtils/GetPosts"
import { CommentContextProvider } from "../../Context/CommentContext"
import { SpinnerCircularFixed } from "spinners-react"
import { useAuth } from "../../Context/AuthContext"
import { capitalize } from "../../utils"

const PostPage = () => {
    const {userData} = useAuth();
    const {firstName, lastName, headline} = userData;
    const location = useLocation();
    const { userID, postID } = useParams();
    const navigate = useNavigate()
    const [post, setPost] = useState(null);
    const [firebaseError, setFirebaseError] = useState(null)

    useEffect(() => {
        async function fetchPost() {
            try {
                const post = await GetPost(postID);
                if (post === null) {
                    // TODO: can also add a not found page.
                    navigate('/feed');
                } else {
                    setPost(post);
                }
            } catch (error) {
                setFirebaseError({ message: error.message, code: error.code });
            }
        }
        fetchPost();
    }, [])

    return (
        <LoggedInPage>
            <div className="post__page__sidebar__left result__section" id="post__page__sidebar__left__id">
                <div className="sidebar__banner"></div>
                <div className="sidebar__container">
                    <div className="sidebar__profile">
                        {/* TODO: add proper userID and get proper information aboout the user whose post is this. */}
                        <ProfileIcon height={60} name={`${capitalize(firstName)} ${capitalize(lastName)}`} imageURL=""/>
                        <p className="post__page__left__title">Arslan Jamil</p>
                        <div className="sidebar__profile__description post__page__sidebar__description">
                            {headline}
                        </div>
                        <Link to={`/in/${auth.currentUser.uid}`} className="post__page__view__full">View full Profile</Link>
                    </div>
                </div>
            </div>
            <div className="post__page__main">
                {post !== null ?
                <CommentContextProvider postID={post.postID}>
                    <Post userID={post.userID} postID={post.postID} mediaType={post.mediaType} postDesc={post.postDesc} mediaURL={post?.mediaURL} component="PostPage" likes={post?.likes}/>
                </CommentContextProvider>
                : <div className="loader"><SpinnerCircularFixed size={50} color="var(--linkedin-blue)"/></div>
                }
            </div>
        </LoggedInPage>
    )
}
export default PostPage

