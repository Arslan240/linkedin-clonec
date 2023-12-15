import { collection, getDocs, query, where } from "firebase/firestore"
import { RECEIVED_REQS_COLL_NAME, NOTIF_FIELD_NAME_SENDERID, USERS_COLL_NAME, auth, db } from "../../firebase-config";


export const GetReceivedRequestsOfOtherUser = async (userID) => {
  try {
    const colRef = collection(db, USERS_COLL_NAME, userID, RECEIVED_REQS_COLL_NAME);
    // colRef.
    const q = query(colRef,
      where(NOTIF_FIELD_NAME_SENDERID, '==', auth.currentUser.uid),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // return null;
    }

    let result = [];
    querySnapshot.forEach((doc) => {
      result.push({ ...doc.data(), docID: doc.id });
    });
    return result.length > 0 ? result : null;
  } catch (error) {
    throw error
  }
}