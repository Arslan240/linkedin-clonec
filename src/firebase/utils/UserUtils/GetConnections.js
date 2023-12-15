import { collection, getDocs, query } from "firebase/firestore";
import { CONNECTIONS_COLL_NAME, USERS_COLL_NAME, auth, db } from "../../firebase-config";

/**
 * Returns connections of passedin userID, if not passed then returns connections of current logged in user
 * @param {*} userID 
 * @returns 
 */
export const GetConnections = async (userID = auth.currentUser.uid) => {
    try {
        const colRef = collection(db, USERS_COLL_NAME, userID, CONNECTIONS_COLL_NAME);
        const q = query(colRef)
        const querySnapShot = await getDocs(q)

        if(querySnapShot.empty){
            return null;
        }

        let results = [];
        querySnapShot.forEach((doc) => {
            results.push({docID: doc.id, ...doc.data()})
        })        
        return results.length > 0 ? results : null;
    } catch (error) {
        throw error;
    }
}