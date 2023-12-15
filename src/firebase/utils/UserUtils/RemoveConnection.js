import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { CONNECTIONS_COLL_NAME, USERS_COLL_NAME, auth, db } from "../../firebase-config"

export const RemoveConnection = async (connectionID) => {
  try {
    const result1 = await removeConnectionFromUser(auth.currentUser.uid, connectionID);
    const result2 = await removeConnectionFromUser(connectionID, auth.currentUser.uid);
    return result1;
  }
   catch (error) {
     throw error;
  }
}

const removeConnectionFromUser = async (userID, connectionID ) => {
  try {
    const colRef = collection(db, USERS_COLL_NAME, userID, CONNECTIONS_COLL_NAME);
    const q = query(colRef, where("userID", "==", connectionID));
    const querySnapShot = await getDocs(q);

    if(querySnapShot.empty){
      throw new Error(`No connection exists with the ID: ${connectionID}`)
    }
    
    querySnapShot.forEach(async (snapDoc) => {
      const docRef = doc(db, USERS_COLL_NAME, userID, CONNECTIONS_COLL_NAME, snapDoc.id)
      const result = await deleteDoc(docRef); 
      return result;
    })
  } catch (error) {
    throw error;
  }
}

