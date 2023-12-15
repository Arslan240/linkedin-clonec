import { collection, getDocs, query } from "firebase/firestore"
import { COMMENTS_COLL_NAME, POSTS_COLL_NAME, db } from "../../firebase-config"

/**
 * 
 * @param {*} postID 
 * @param {*} userID 
 * @returns 
 */
export const GetComments = async (postID, userID="") => {
    try {
        const q = query(collection(db, `/posts/${postID}/comments`))
        const querySnapShot = await getDocs(q);

        if(querySnapShot.empty){
            return [];
        }

        let results = [];
        querySnapShot.forEach((doc) => {
            results.push({docID: doc.id, ...doc.data()});
        })
        return results.length > 0 ? results : [];
    } catch (error) {
        throw error;
    }
}