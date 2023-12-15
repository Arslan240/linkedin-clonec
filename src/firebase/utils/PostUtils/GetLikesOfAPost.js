import { doc, getDoc } from "firebase/firestore"
import { POSTS_COLL_NAME, db } from "../../firebase-config"


export const GetLikesOfAPost = async (postID) => {
  try {
    const docRef = doc(db, POSTS_COLL_NAME, postID)
    const docSnapShot = await getDoc(docRef)
    
    if(!docSnapShot.exists()) throw new Error("No Post for id:", postID);

    const likes = await docSnapShot.data().likes;
    return likes;
  } catch (error) {
    throw error;
  }
}