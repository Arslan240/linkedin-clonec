import { collection, getDocs, query, where } from "firebase/firestore";
import {  FOLLOWING_COLL_NAME, auth, db } from "../../firebase-config";

/**
 * Returns an array of followers of passedin userID, if not passed then returns an array of followers of current logged in user
 * @param {*} userID 
 */
export const GetFollowers = async (userID = auth.currentUser.uid) => {
    try {
        const colRef = collection(db, FOLLOWING_COLL_NAME);
        const q = query(colRef, 
        where("userID", "==", userID)
        )
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty) {
            return null;
        }

        let results = []
        querySnapshot.forEach((doc) => {
            results.push({docID: doc.id, ...doc.data()})
        })
        return results;
    } catch (error) {
        throw error;
    }
}

/**
 * Returns an array of users which the userID is following, if not passed then returns an array of users followed by current logged in user
 * @param {*} userID 
 */
export const GetFollowing = async (userID = auth.currentUser.uid) => {
    try {
        const colRef = collection(db, FOLLOWING_COLL_NAME);
        const q = query(colRef, 
        where("followerID", "==", userID)
        )
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty) {
            return null;
        }

        let results = []
        querySnapshot.forEach((doc) => {
            results.push({docID: doc.id, ...doc.data()})
        })
        return results;
    } catch (error) {
        throw error;
    }
}

