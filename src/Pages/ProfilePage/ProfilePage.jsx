import "./ProfilePage.css"
import { ActivityMedia, LoggedInPage, ProfileIcon } from '../../components'
import ProfileDetails from './ProfileDetails/ProfileDetails'
import { FiEdit2 } from 'react-icons/fi'
import { AiFillCamera } from "react-icons/ai"
import { MEDIA_TYPE_DOC, MEDIA_TYPE_IMAGES, MEDIA_TYPE_NONE, MEDIA_TYPE_VIDEO, auth } from "../../firebase/firebase-config"
import useProfileModal from "../../hooks/useProfileModal"
import EducationModal from "../../components/EducationModal/EducationModal"
import EditEducationModal from '../../components/Modals/EditEducationModal/EditEducationModal'
import ProfileModal from '../../components/Modals/ProfileModal/ProfileModal'
import ExperienceModal from '../../components/Modals/ExperienceModal/ExperienceModal'
import { Suspense, useEffect, useState } from "react"
import EducationContextProvider from "../../Context/EducationContext"
import ExperienceContextProvider from "../../Context/ExperienceContext"
import { GetConnections, GetFollowers, GetPosts } from "../../firebase/utils"
import { Link } from "react-router-dom"
import { CommentContextProvider, useComments } from "../../Context/CommentContext"
import { PostContextProvider, usePost } from "../../Context/PostContext"
import { useAuth } from "../../Context/AuthContext"
import { capitalize } from "../../utils"


const icon_size = 20
const profile_icon_small = 100;
const profile_icon_large = 150;
export const EDUCATION_TITLE = "Education";
export const EXPERIENCE_TITLE = "Experience";
// use useEffect for responsive design of profile_icon_large
const FILTER_POSTS = "filter_posts"
const FILTER_VIDEOS = "filter_videos"
const FILTER_IMAGES = "filter_images"
const FILTER_DOCUMENTS = "filter_documents"

const ProfilePage = () => {
    const {userData} = useAuth();
    const {firstName, lastName, headline, city, country, schoolName, company} = userData;
    const { isOpen, onClose, onOpen } = useProfileModal();
    const [filter, setFilter] = useState(FILTER_POSTS);
    const [posts, setPosts] = useState([]);
    const [noPosts, setNoPosts] = useState(false);
    const [filterdPosts, setFilteredPosts] = useState(posts);

    const [connections, setConnections] = useState([]);
    const [noConnections, setNoConnections] = useState(false);

    const [followers, setFollowers] = useState([]);
    const [noFollowers, setNoFollowers] = useState(false);

    const fetchPosts = async () => {
        const result = await GetPosts();
        if (!result) {
            setNoPosts(true);
        }
        setPosts(result);
    }

    useEffect(() => {
        try {
            fetchPosts();
        } catch (error) {
            throw error;
        }
    }, [])

    useEffect(() => {
        async function fetchConnections(){
            try {
                const connResult = await GetConnections();
                if(connResult){
                    setConnections(connResult);
                    setNoConnections(true);
                }else{
                    setNoConnections(true);
                }

                const followers = await GetFollowers()
                if (followers === null) {
                    setNoFollowers(true);
                    return;
                }
                setFollowers(followers)
                setNoFollowers(false);
            } catch (error) {
                setFirebaseError({message:error.message, code: error.code});
            }
        }
        fetchConnections()
    },[])


    useEffect(() => {
        if(!posts) {
            setNoPosts(true);
            return;
        }
        if (filter === FILTER_POSTS) {
            setFilteredPosts(posts);
        } else if (filter === FILTER_DOCUMENTS) {
            setFilteredPosts(posts.filter(item => item.mediaType === MEDIA_TYPE_DOC))
        } else if (filter === FILTER_IMAGES) {
            setFilteredPosts(posts.filter(item => item.mediaType === MEDIA_TYPE_IMAGES))
        } else if (filter === FILTER_VIDEOS) {
            setFilteredPosts(posts.filter(item => item.mediaType === MEDIA_TYPE_VIDEO))
        }
        setNoPosts(false);
    }, [filter, posts])


    return (
        <LoggedInPage>
            <EducationContextProvider>
                <EducationModal prevOnOpen={onOpen} />
            </EducationContextProvider>
            <ExperienceContextProvider>

                {/* Always have these modals at highes level in html hierarchy other wise the onOpen is called after calling onClose function. idk why */}
                {/* <Suspense> */}
                <ProfileModal isOpen={isOpen} onClose={onClose} />
                {/* </Suspense> */}
                {/* <Suspense> */}

                {/* <EditEducationModal prevOnOpen={onOpen} /> */}
                {/* </EducationContextProvider> */}
                {/* </Suspense> */}

                {/* <Suspense> */}
                {/* <ExperienceContextProvider> */}
                <ExperienceModal prevOnOpen={onOpen} />
                {/* </ExperienceContextProvider> */}
                {/* </Suspense> */}
                <div className="profile__page__main">
                    <div className="profile__page__profile__section profile__page__section">
                        <div className="profile__page__banner">
                            <div className="profile__page__cam_container">
                                <div className="profile__page__icon__container profile__page__cam_icon">
                                    <AiFillCamera size={icon_size} color="var(--linkedin-blue)" className="profile__page__icon" />
                                </div>
                            </div>
                        </div>
                        <div className="profile__page__not__banner">

                            <div className="profile__page__edit__and__img_container">
                                <div className="profile__page__profile__icon__container">
                                    <ProfileIcon height={profile_icon_large} name={`${firstName} ${lastName}`} imageURL=""/>
                                </div>
                                <div className="profile__page__icon__container" onClick={onOpen}>
                                    <FiEdit2 size={icon_size} />
                                </div>
                            </div>

                            <div className="profile__page__description__container">
                                <div className="profile__page__name__description">
                                    <div className="profile__page__name"><span>{`${capitalize(firstName)} ${capitalize(lastName)}`}</span></div>
                                    <span className="profile__page__description">
                                        {headline}
                                    </span>
                                </div>
                                <div className="profile__page__school__company__top">
                                    Company Icon
                                    <div className="profile__page__school__company__name">{company ? capitalize(company) : !!schoolName && capitalize(schoolName)}</div>
                                </div>
                            </div>
                            <div>
                                <span className="profile__page__location">{city}, {country}&nbsp;</span>
                                {/* TODO: add contact dialog */}
                                <a className="profile__page__link blue-bold">Contact Info</a>
                            </div>
                            {!noConnections && 
                                <Link to="/mynetwork/connections" className=" blue-bold" id="profile__page__link">{connections.length} connections</Link>
                            }
                        </div>
                    </div>

                    <div className="profile__page__activity__section result__section">
                        <div className="profile__page__activity__title__container">
                            <div className="profile__page__activity__title">
                                <div>
                                    <span className="profile__page__activity__title">Activity</span>
                                </div>
                                {!noFollowers &&
                                    <Link to="/mynetwork/follow_manager" className=" blue-bold" id="profile__page__link">{followers.length} followers</Link>
                                }
                            </div>
                            {/* <div className="profile__page__icon__container">
                            <FiEdit2 size={icon_size} />
                        </div> */}
                        </div>
                        {/* TODO: Potential Custom Component */}
                        <div className="notif__page__result__filters">
                            <div className={`notif__page__result__filter ${filter === FILTER_POSTS && "active"}`} onClick={() => setFilter(FILTER_POSTS)}>Posts</div>
                            <div className={`notif__page__result__filter ${filter === FILTER_VIDEOS && "active"}`} onClick={() => setFilter(FILTER_VIDEOS)}>Videos</div>
                            <div className={`notif__page__result__filter ${filter === FILTER_IMAGES && "active"}`} onClick={() => setFilter(FILTER_IMAGES)}>Images</div>
                            <div className={`notif__page__result__filter ${filter === FILTER_DOCUMENTS && "active"}`} onClick={() => setFilter(FILTER_DOCUMENTS)}>Documents</div>
                        </div>

                        {noPosts ? (<>There are no posts.</>) : filterdPosts.map(post => (
                            <CommentContextProvider postID={post.docID}>
                                <PostContextProvider postID={post.docID}>
                                    <ProfilePagePost post={post} />
                                </PostContextProvider>
                            </CommentContextProvider>
                        ))}

                        {/* <div className="network__page__results_seeAll">
                            Show All Posts<span>&nbsp;{posts.length}</span>
                        </div> */}
                    </div>
                    <ProfileDetails title={EXPERIENCE_TITLE} />
                    <ProfileDetails title={EDUCATION_TITLE} />
                </div>
                <div className="profile__page__right result__section">
                    Left
                </div>
            </ExperienceContextProvider>
        </LoggedInPage>
    )
}
export default ProfilePage

const ProfilePagePost = ({ post }) => {
    const { comments } = useComments();
    const { likes } = usePost();

    return (
        <Link to={`/in/${auth.currentUser.uid}/activity/post/${post.docID}`} className="profile__page__activity__container profile__page__post__link">
            <div className="profile__page__post__information profile__text__light profile__page__font__small">
                {/* TODO: make it show relativeTime */}
                {/* <span className="profile__page__post__information__title ">Arslan Jamil </span><span>posted this • </span><span>3mo</span> */}
            </div>
            <div className="profile__page__actual__activity">
                {post.mediaType !== MEDIA_TYPE_NONE &&
                    <ActivityMedia mediaURL={post.mediaURL} mediaType={post.mediaType} />
                }
                <div>
                    <span className="profile__page__activity__description">{post.postDesc}</span>
                    {post.postDesc !== "" && <a className="profile__page__show__more__link profile__text__light ">...show more</a>}
                </div>
            </div>
            <div className="profile__page__post__reactions profile__text__light profile__page__font__small">
                <div className="reactions">
                    <span>{likes.length > 0 && `${likes.length} like${likes.length > 1 ? "s" : ""}`}</span>
                </div>
                <div className="comments">
                    <span>{comments.length > 0 && `${comments.length} comment${comments.length > 1 ? "s" : ""}`}</span>
                </div>
            </div>
        </Link>
    )
}