import {addDoc, collection} from 'firebase/firestore'
import {EDUCATION_COLL_NAME, EXPERIENCE_COLL_NAME, USERS_COLL_NAME, auth, db} from '../../firebase-config'

export const AddEducation = async (userData,userID = auth.currentUser.uid) => {
  try {
    const colRef = collection(db, USERS_COLL_NAME,userID,EDUCATION_COLL_NAME);
    const docRef = await addDoc(colRef, userData)
    return docRef;
  } catch (error) {
    throw error;
  }
}

export const AddExperience = async (userData, userID = auth.currentUser.uid) => {
  try {
    const colRef = collection(db,USERS_COLL_NAME, userID, EXPERIENCE_COLL_NAME)
    const docRef = await addDoc(colRef, userData);
    return docRef;
  } catch (error) {
    throw error;
  }
}