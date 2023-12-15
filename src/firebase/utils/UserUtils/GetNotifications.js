import { collection, getDocs, query, where } from "firebase/firestore"
import { NOTIF_COLL_NAME, USERS_COLL_NAME, auth, db } from "../../firebase-config"

export const GetNotifications = async (userID = auth.currentUser.uid) => {
  try {
    
    const collRef = collection(db, USERS_COLL_NAME, userID, NOTIF_COLL_NAME);
    const q = query(collRef)
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) {
      return [];
    }

    let results = [];
    querySnapshot.forEach((doc) => {
      results.push({docID: doc.id, ...doc.data()})
    });
    return results;
  } catch (error) {
    throw error;
  }
}