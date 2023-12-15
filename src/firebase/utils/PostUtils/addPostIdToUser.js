import { USERS_COLL_NAME, db } from '../../firebase-config'
import { auth } from '../../firebase-config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const addPostIdToUser = async (postId) => {
    try {
        const prevPostIDs = await getCurrentUserPostIDs();
        let newPostIDs = [];
        if(prevPostIDs){
            newPostIDs = [...prevPostIDs, postId]
        }else {
            newPostIDs.push(postId);
        }

        const docRef = doc(db, USERS_COLL_NAME, auth.currentUser.uid)
        await setDoc(docRef, { 
            posts: newPostIDs
         }, { merge: true })
    } catch (error) {
        throw error;
    }
}

const getCurrentUserPostIDs = async () => {
    const docRef = doc(db, USERS_COLL_NAME, auth.currentUser.uid);
    const user = await getDoc(docRef);
    return user.get("posts");
}