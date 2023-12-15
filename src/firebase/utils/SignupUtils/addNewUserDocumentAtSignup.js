import { doc, setDoc } from "firebase/firestore"
import { USERS_COLL_NAME, auth } from "../../firebase-config";
import { db } from "../../firebase-config"

export const addNewUserDocumentAtSignup = async (userData) => {
  const uid = auth.currentUser.uid
  try {
    // Add a new document to the "users" collection
    const docRef = doc(db, USERS_COLL_NAME, uid);
    await setDoc(docRef, userData, {merge: true});
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
