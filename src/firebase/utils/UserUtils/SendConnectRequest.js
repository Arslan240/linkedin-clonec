import { Timestamp, addDoc, collection, doc } from "firebase/firestore"
import { RECEIVED_REQS_COLL_NAME, NOTIF_FIELD_NAME_RECEIVERID, NOTIF_FIELD_NAME_SENDERID, USERS_COLL_NAME, auth, db, SENT_REQS_COLL_NAME, STATUS_PENDING, NOTIF_FIELD_NAME_STATUS } from "../../firebase-config"
import { GetReceivedRequestsOfOtherUser } from "./GetReceivedRequestsOfOtherUser"
import { AddToFollowingCollection } from "./AddToFollowingCollection";

/**
 * This function sends connection request
 * @param senderID 
 * @param receiverID 
 * @returns docRef
 */

export const SendConnectRequest = async (senderID, receiverID) => {
    try {
        const bool = await isRequestAlreadySent(receiverID);
        if (bool) {
            throw new Error("Request is Already Sent");
        }
        const docRef = await addDoc(collection(db, USERS_COLL_NAME, receiverID, RECEIVED_REQS_COLL_NAME), {
            [NOTIF_FIELD_NAME_SENDERID]: senderID,
            [NOTIF_FIELD_NAME_RECEIVERID]: receiverID,
            [NOTIF_FIELD_NAME_STATUS]: STATUS_PENDING,
        })
        const sentDocRef = await addToSentRequests(receiverID);
        const followDocRef = await AddToFollowingCollection(receiverID)
        return docRef;
    } catch (error) {
        throw error;
    }
}

const isRequestAlreadySent = async (receiverID) => {
    try {
        const conn_reqs = await GetReceivedRequestsOfOtherUser(receiverID);
        if (!conn_reqs) {
            return false;
        }
        const connectionRequest = conn_reqs.find((req) => req.senderID === auth.currentUser.uid)

        if (connectionRequest) {
            return true;
        }
        else {
            return true;
        };
    } catch (error) {
        throw error;
    }
}

// const requestType = {
//     receiverID: "",
//     status: "", // accepted, rejected
// }


const addToSentRequests = async (receiverID) => {
    try {
        const docRef = addDoc(collection(db, USERS_COLL_NAME, auth.currentUser.uid, SENT_REQS_COLL_NAME), {
            receiverID,
            status: STATUS_PENDING,
        })
        return docRef;
    } catch (error) {
        throw error
    }
}

