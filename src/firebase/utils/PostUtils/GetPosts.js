import {collection, doc, getDoc, getDocs, orderBy, query, where} from 'firebase/firestore'
import {auth, db, POSTS_COLL_NAME} from '../../firebase-config.js'

export const GetPosts = async (userID = auth.currentUser.uid) => {
    try {
        const q = query(collection(db,POSTS_COLL_NAME),
            where("userID","==", userID),
            orderBy("timeStamp", 'desc')
        )
        const querySnapShot = await getDocs(q);
        if(querySnapShot.empty){
            return null;
        }

        const results = [];
        querySnapShot.forEach((doc) => {
            results.push({docID: doc.id, ...doc.data()})
        })
        return results.length > 0 ? results : null;
    } catch (error) {
        throw error;
    }
}

export const GetPost = async (postID) => {
    try {
        const docRef = doc(db, POSTS_COLL_NAME, postID)
        const docSnapShot = await getDoc(docRef)
        if(!docSnapShot.exists()){
            return null;
        }
        return {docID: docSnapShot.id, ...docSnapShot.data()}
    } catch (error) {
        throw error;
    }
}