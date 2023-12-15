import { collection, getDocs, query, where, doc } from "firebase/firestore"
import { FOLLOWERS_COLL_NAME, db } from "../../firebase-config"


// searchTerms[0] = followerID
// searchTerms[1] = userID

 const AddFollower = async (userID) => {

}

 const RemoveFollower = async (userID, followerID) => {
  try {
    const colRef = collection(db, FOLLOWERS_COLL_NAME);
    const q = query(colRef, where("followerID", "==", userID)); //it'll contain all followers and following of this userID. we'll only delete where followerID is user and userID is userID. And also we'll delete those
    const querySnapShot = await getDocs(q);

    if(querySnapShot.empty){
      throw new Error("No connections found for: ", userID);
    }

    querySnapShot.forEach(async (snapDoc) => {
      const data = snapDoc.data();
      const docRef = doc(db, FOLLOWERS_COLL_NAME, )
    })
  } catch (error) {
    
  }
}