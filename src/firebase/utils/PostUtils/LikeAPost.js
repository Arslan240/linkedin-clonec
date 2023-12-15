import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { POSTS_COLL_NAME, auth, db } from "../../firebase-config";
import { GetLikesOfAPost } from "./GetLikesOfAPost";

/**
 * Returns updated array of likes after performing the like or dislike operation.
 * @param {*} likeValue 
 * @param {*} postID 
 * @returns 
 */

export const LikeAPost = async (likeValue, postID) => {
    try {
        // const postRef = db.collection('posts').doc(postID);
        const postDocRef = doc(db, POSTS_COLL_NAME, postID)
        // Use arrayUnion to add the new userID to the likes array
        if(likeValue){
            await updateDoc(postDocRef, {
              likes: arrayUnion(auth.currentUser.uid)
            });
            const likes = GetLikesOfAPost(postID)
            return likes;
        }else {
            await updateDoc(postDocRef, {
                likes: arrayRemove(auth.currentUser.uid)
            })
            const likes = GetLikesOfAPost(postID)
            return likes;
        }
    } catch (error) {
        throw error;
    }
}