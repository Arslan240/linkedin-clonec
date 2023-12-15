import { createContext, useContext, useEffect, useState } from "react";
import { GetPost } from "../firebase/utils";

// @ts-ignore
const PostContext = createContext<{
    likes: [],
    post: any,
}>();
export const FLAG_REPLY = "flag_reply"

export const PostContextProvider = ({children, postID}) =>{

    const [likes, setLikes] = useState([]);
    const [post, setPost] = useState();

    useEffect(() => {
        async function fetchPost(){
            try {
                const result = await GetPost(postID);
                if(!result) setPost(null);
                else setPost(result);
                const {likes} = result;
                if(likes){
                    setLikes(likes);
                }
            } catch (error) {
                throw error;
            }
        }
        fetchPost();
    },[postID])


    return (
        // @ts-ignore
        <PostContext.Provider value={{likes, post}}>
            {children}
        </PostContext.Provider>
    )

}
export const usePost = () => useContext(PostContext);