import "./Feed.css"
import CreatePost from "./CreatePost/CreatePost"
import Post from "./Post/Post"
import { useEffect, useState } from "react"
import { GetPosts } from "../../../firebase/utils"
// import { auth } from "../../../firebase/firebase-config.js"
// import { useLocation } from "react-router-dom"
import { SpinnerCircularFixed } from "spinners-react"
import { CommentContextProvider } from '../../../Context/CommentContext.jsx'
// type Props = {}

// function isPathMatchesHomeUrl() {
//   const location = useLocation();
//   const postUrlPattern = `/feed`;

//   return location.pathname.startsWith(postUrlPattern);
// }

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [_firebaseError, setFirebaseError] = useState(null);
  const [postAdded, setPostAdded] = useState(false); //to rerender feed.
  const [noPosts, setNoPosts] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const results = await GetPosts(true);
        if(!results) {
          setNoPosts(true);
          return;
        } //TODO: add functionality of refetch posts if posts are null. Findout how it can be implemented.
        setPosts(results);
      } catch (error: any) {
        setFirebaseError({ message: error.message, code: error.code })
      }
    }
    fetchPosts()
  }, [postAdded])


  return (
    <div className="feed">
      <CreatePost setPostAdded={setPostAdded} />
      <hr className="feed__line" />
      {posts.length > 0 ?
        (
          posts.map((post) => {
            const { postID, userID, postDesc, mediaType } = post;
            let mediaURL = undefined;
            let likes = post?.likes;

            if (post?.mediaURL) {
              mediaURL = post.mediaURL;
            }

            // if (post?.likes) {
            //   likes = post.likes;
            // }
            
            return (
              <CommentContextProvider postID={postID}>
                <Post
                  key={postID}
                  postID={postID}
                  userID={userID}
                  postDesc={postDesc}
                  mediaType={mediaType}
                  mediaURL={mediaURL}
                  likes={likes}
                  component={"HomePage"}
                />
              </CommentContextProvider>
            )
          })
        )
        : noPosts ? (
          <div>
            There are no posts.
          </div>
        ) : <div className="feed__loading__container"><SpinnerCircularFixed color="var(--linkedin-blue)" size={40} /></div>
      }
      {/* <Post/>
      <Post/> */}
    </div>
  )
}
export default Feed