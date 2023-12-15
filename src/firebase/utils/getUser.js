import { doc, getDoc } from "firebase/firestore";
import { USERS_COLL_NAME, auth, db } from "../firebase-config";

/**
 * by default it'll return loggedin user. If an id is passed then it'll return that specific user.
 * User user.data() for data.
 * @param {*} userID 
 * @returns 
 */
export const getUser = async (userID = auth.currentUser.uid) => {
    try {
        const docRef = doc(db, USERS_COLL_NAME, userID);
        const user = await getDoc(docRef);
        // new addition
        if(!user.exists()){
            return null;
        }
        return user;
    } catch (error) {
        throw error;
    }
}