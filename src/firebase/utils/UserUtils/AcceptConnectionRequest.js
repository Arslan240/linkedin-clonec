import  {collection, addDoc, Timestamp, doc, deleteDoc} from 'firebase/firestore' 
import { CONNECTIONS_COLL_NAME, FOLLOWING_COLL_NAME, RECEIVED_REQS_COLL_NAME, USERS_COLL_NAME, auth, db } from '../../firebase-config'
import { AddToFollowingCollection } from './AddToFollowingCollection';

export const AcceptConnectionRequest = async (senderID, receivedReqDocID) => {
    const docID = receivedReqDocID;
    try {
        const connRef = await addToConnectionCol(senderID);
        await deleteFromReceivedRequests(docID);
        const followRef = await AddToFollowingCollection(senderID);
        return followRef;
    } catch (error) {
        throw error
    }
}


// Add to connection collection
// Delete from received requests
// add to following collection

// write a cloud function which adds to notifications of sender
// adds to connection of the sender
// remove from sent_requests of the sender
// we add accepted or rejected because in cloud function will send notification to user id if the type is accepted, which means that you accepted a request. Now notification should be sent to the requesting user. But in the requesting user's connection collection, the object will have requested flag, which means you're being notified and cloud function will not do anything.
const addToConnectionCol = async (senderID) => {
    try {
        const colRef = collection(db, USERS_COLL_NAME, auth.currentUser.uid, CONNECTIONS_COLL_NAME);
        const docRef = addDoc(colRef, {
            userID: senderID,
            type: 'accepted', //accepted OR requested
            timeStamp: Timestamp.now(),
        })
        return docRef;
    } catch (error) {
        throw error;
    }
}

const deleteFromReceivedRequests = async (docID) => {
    try {
        const docRef = doc(db, USERS_COLL_NAME, auth.currentUser.uid, RECEIVED_REQS_COLL_NAME, docID)
        await deleteDoc(docRef)
    } catch (error) {
        throw error;
    }
}