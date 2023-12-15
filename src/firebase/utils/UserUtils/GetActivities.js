import {  collection, getDocs, orderBy, query } from "firebase/firestore"
import { EDUCATION_COLL_NAME, EXPERIENCE_COLL_NAME, USERS_COLL_NAME, auth, db } from "../../firebase-config"

export const GetEducation = async (userID = auth.currentUser.uid) => {
  try {
    const colRef = collection(db, USERS_COLL_NAME, userID, EDUCATION_COLL_NAME)
    const q = query(colRef, orderBy("startDate","desc"));
    const querySnapshot = await getDocs(q); 
    
    if(querySnapshot.empty) {
      return null;
    }

    let results = [];
    querySnapshot.forEach((docSnap) => {
      results.push({docID: docSnap.id, ...docSnap.data()});
    })
    return results;
  } catch (error) {
    throw error;
  }
}

export const GetExperience = async (userID = auth.currentUser.uid) => {
  try {
    const colRef = collection(db, USERS_COLL_NAME, userID, EXPERIENCE_COLL_NAME)
    const q = query(colRef, orderBy("startDate","desc"));
    const querySnapshot = await getDocs(q); 

    if(querySnapshot.empty) {
      return null;
    }
    
    let results = [];
    querySnapshot.forEach((docSnap) => {
      results.push({docID: docSnap.id, ...docSnap.data()});
    })
    return results;
  } catch (error) {
    throw error;
  }
}