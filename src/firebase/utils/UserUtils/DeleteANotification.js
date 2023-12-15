import { deleteDoc, doc } from "firebase/firestore"
import { NOTIF_COLL_NAME, USERS_COLL_NAME, auth, db } from "../../firebase-config"

export const DeleteANotification = async (notifID, userID = auth.currentUser.uid) => {
  try {
    const docRef = doc(db, USERS_COLL_NAME, userID, NOTIF_COLL_NAME, notifID);
    await deleteDoc(docRef)
    return docRef
  } catch (error) {
    throw error;
  }
}