import { useLocation } from "react-router-dom";
import Post from "../../../HomePage/Feed/Post/Post"
import { SpinnerCircularFixed } from "spinners-react";
import { useEffect, useState } from "react";
import { SearchPost, SearchUserFromFirebase } from "../../../../firebase/utils";

const PostRenderer = () => {
  const [posts, setPosts] = useState([]);
  const [noPosts, setNoPosts] = useState(false);
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query")

    useEffect(() => {
       async function performSearch(){
        try {
          const results = await SearchPost(query);
          if(!results) {
            setPosts(null);
            setNoPosts(true);
            return;
          }
          setPosts(results);
          setNoPosts(true);
        } catch (error) {
          throw error;
        } 
       }

       performSearch();
    })


  return (
    <>
        {/* <Post/>
        <Post/> */}
    </>
  )
}
export default PostRenderer