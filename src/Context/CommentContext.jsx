import { createContext, useContext, useEffect, useState } from "react";
import { AddACommentToPost, AddReplyToAComment, GetComments } from "../firebase/utils";

const CommentContext = createContext();
export const FLAG_REPLY = "flag_reply"

export const CommentContextProvider = ({children, postID}) =>{
    const [comments, setComments] = useState([]);
    const [commentsLength, setCommentsLength] = useState(comments.length)
    const [isReplyCommentShown, setIsReplyCommentShown] = useState({state: false, commID: ""});
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(() => {  
        function replaceRepliesWithComments(comment, allComments) {
            const updatedReplies = comment.replies.map(replyID => {
                if(replyID === ""){
                    return "";
                }

                const matchingCommentIndex = allComments.findIndex(c => c.docID === replyID);
                if (matchingCommentIndex !== -1) {
                    const matchingComment = allComments[matchingCommentIndex];

                    allComments.splice(matchingCommentIndex, 1); // Remove the reply from the comments array
                    const updatedComment = replaceRepliesWithComments(matchingComment, allComments);
                    
                    return updatedComment;
                }
                return replyID;
            });
            return { ...comment, replies: updatedReplies };
        }      

        async function fetchComments(){
            try {
                const results = await GetComments(postID);
                setCommentsLength(results?.length)
                const updatedComments = results.map(comment =>
                    replaceRepliesWithComments(comment, results)
                );
                
                const finalComments = updatedComments.filter(comment => !comment.replies.includes(comment.docID));

                setComments(updatedComments.length > 0 ? updatedComments : []);
                // setComments(finalComments.length > 0 ? finalComments : []);
            } catch (error) {
                throw error;
            }
        } 
        fetchComments();
    },[isLoading])

    const handleCommentSubmit = async (commentValue,postID,commentID, flag) => {
        if(commentValue === "") return; //TODO: add validation error

        setIsLoading(true);
        try {
            if(!flag && postID){
                // add comment to post
                const docRef = await AddACommentToPost(commentValue,postID)
            }else if(flag === FLAG_REPLY && commentID && postID){
                // add comment to comment
                const {replyDocRef} = await AddReplyToAComment(commentValue, postID, commentID)
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CommentContext.Provider value={{comments,isReplyCommentShown, commentsLength, isLoading, setIsReplyCommentShown, handleCommentSubmit}}>
            {children}
        </CommentContext.Provider>
    )

}
export const useComments = () => useContext(CommentContext);