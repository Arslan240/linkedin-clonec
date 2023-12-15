import { addDoc, collection } from "firebase/firestore";
import { FOLLOWING_COLL_NAME, auth, db } from "../../firebase-config";


// TODO: Add the functionality when you send a connection request to someone, you start following them.
export const AddToFollowingCollection = async (userID) => {
    try {
        const colRef = collection(db, FOLLOWING_COLL_NAME)
        const docRef = addDoc(colRef, {
            followerID: auth.currentUser.uid,
            userID: userID,
            searchTerms: [auth.currentUser.uid, userID]
        })
        return docRef;  
    } catch (error) {
        (error.message)
        throw error;
    }
}