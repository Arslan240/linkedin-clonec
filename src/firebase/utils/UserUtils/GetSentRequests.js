import { collection, getDocs, query } from "firebase/firestore"
import { SENT_REQS_COLL_NAME, USERS_COLL_NAME, auth, db } from "../../firebase-config"

export const GetSentRequests = async () => {
    try {
        const q = query(collection(db, USERS_COLL_NAME,auth.currentUser.uid,SENT_REQS_COLL_NAME))
        const docSnapShot = await getDocs(q)
    
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
        return null;
        }

        let result = [];
        querySnapshot.forEach((doc) => {
            result.push({ ...doc.data(), docID: doc.id });
        });
        return result.length > 0 ? result : null;
    } catch (error) {
        throw error;   
    }
}