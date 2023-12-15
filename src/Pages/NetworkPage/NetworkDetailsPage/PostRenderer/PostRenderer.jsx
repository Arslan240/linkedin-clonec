import { useLocation } from "react-router-dom";
import Post from "../../../HomePage/Feed/Post/Post"
import { SpinnerCircularFixed } from "spinners-react";
import { useEffect, useState } from "react";
import { SearchUserFromFirebase } from "../../../../firebase/utils";

const PostRenderer = () => {
  // props are missing from Post
  return (
    <>
        <Post /> 
        {/* <Post/> */}
    </>
  )
}
export default PostRenderer