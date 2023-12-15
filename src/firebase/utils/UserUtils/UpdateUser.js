import { doc, updateDoc } from "firebase/firestore";
import { USERS_COLL_NAME, auth, db } from "../../firebase-config";

export const UpdateUser = async (userData, userID = auth.currentUser.uid) => {
  try {
    const docRef = doc(db, USERS_COLL_NAME, userID)
    const result = await updateDoc(docRef, userData)
    return result;
  } catch (error) {
    throw error;
  }
}

