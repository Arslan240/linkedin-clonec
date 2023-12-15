import { nanoid } from "nanoid";
import { db, auth, POSTS_COLL_NAME, MEDIA_TYPE_NONE } from "../../firebase-config";
import {Timestamp, addDoc, collection, doc, setDoc} from 'firebase/firestore'


// we are using addDoc because we need the firebase 
export const addNewTextPost = async (postDesc) => {
    if(auth.currentUser){
        const newPostID = nanoid()
        try {
            // const docRef = doc(db, POSTS_COLL_NAME, newPostID)
            const postRef = await setDoc(doc(db, POSTS_COLL_NAME, newPostID), {
                userID: auth.currentUser.uid,
                postID: newPostID,
                postDesc,
                mediaType: MEDIA_TYPE_NONE, //none for only text
                timeStamp: Timestamp.now(),
                likes: [],
            })
            return newPostID;
        } catch (error) {
            return error;
        }
    }
}

export const addNewMediaPost = async (postDetails) => {
    const {postDesc, mediaURL, mediaType} = postDetails;

    if(auth.currentUser){
        const newPostID = nanoid()
        try {
            // const docRef = doc(db, POSTS_COLL_NAME, newPostID)
            const postRef = await setDoc(doc(db, POSTS_COLL_NAME, newPostID), {
                userID: auth.currentUser.uid,
                postID: newPostID,
                postDesc,
                mediaURL,
                mediaType: mediaType,
                timeStamp: Timestamp.now()
            })
            return newPostID;
        } catch (error) {
            return error;
        }
    }
}