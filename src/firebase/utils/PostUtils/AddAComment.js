import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore"
import { COMMENTS_COLL_NAME, POSTS_COLL_NAME, auth, db } from "../../firebase-config"

export const AddACommentToPost = async (commentBody, postID, parentCommentID) => {
    if(parentCommentID === null || !parentCommentID){
        parentCommentID = "";
    }

    try {
        const docRef = await addDoc(collection(db, POSTS_COLL_NAME, postID, COMMENTS_COLL_NAME), {
            body: commentBody,
            userID: auth.currentUser.uid,
            replies: [],
            parentCommentID: parentCommentID,
            // TODO: Also add postID to comment because when a comment id is added to a notification, there is no way to query a comment becuase each post has it's own comments collection.
        })
        return docRef;
    } catch (error) {
        throw error;
    }
}

/**
 * Add a new comment to postID comments collection. commentID is comment to which reply is being added. New reply comment id is added to replies array of commentID document.
 * @param {*} replyValue 
 * @param {*} postID 
 * @param {*} commentID 
 * @returns new comment id.
 */
export const AddReplyToAComment = async (replyValue, postID, commentID) => {
    try {
        const replyDocRef = await AddACommentToPost(replyValue, postID, commentID)
        const commentDocRef = doc(db, POSTS_COLL_NAME, postID, COMMENTS_COLL_NAME, commentID)

        // Use arrayUnion to add the new userID to the likes array
        await updateDoc(commentDocRef, {
            replies: arrayUnion(replyDocRef.id)
        });
        return {replyDocRef, commentID};
    } catch (error) {
        throw error;
    }
}