import {collection, doc, getDoc, getDocs, orderBy, query, where} from 'firebase/firestore'
import {auth, db, POSTS_COLL_NAME} from '../../firebase-config.js'
import { GetConnections } from '../UserUtils/GetConnections.js'

export const GetPosts = async (includeConns = false,userID = auth.currentUser.uid) => {
    console.log(includeConns, userID)
    try {
        var connectionIds = []
        if (includeConns) {connectionIds = (await GetConnections()).map((item) => item.userID)}
        const q = query(collection(db,POSTS_COLL_NAME),
            where("userID", "in", [userID, ...connectionIds]),
            // where("userID","==",userID),
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
        console.log(connectionIds)
        console.log(results)
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