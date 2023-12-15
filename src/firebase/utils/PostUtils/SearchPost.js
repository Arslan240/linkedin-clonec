import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { POSTS_COLL_NAME, db } from "../../firebase-config"

export const SearchPost = async (searchQuery) => {
  try {
    const colRef = collection(db, POSTS_COLL_NAME);
    const q = query(colRef,
      where('postDesc', '>=', searchQuery),
      where('postDesc', '<=', searchQuery + '\uf8ff'),
      orderBy('postDesc'))
    const querySnapShot = await getDocs(q)

    if(querySnapShot.empty) return null;

    let results = [];
    querySnapShot.forEach((doc) => {
      results.push({docID: doc.id, ...doc.data()})
    }) 
    return results;
  } catch (error) {
    throw error;
  }
}