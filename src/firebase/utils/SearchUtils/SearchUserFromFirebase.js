import {db, auth, USERS_COLL_NAME, FIELD_SEARCH_TERMS} from '../../firebase-config.js'
import { collection, query, where, getDocs } from "firebase/firestore";


export const SearchUserFromFirebase = async (searchQuery) => {
  try {
    const q = query(collection(db, USERS_COLL_NAME),
        where(FIELD_SEARCH_TERMS, 'array-contains', searchQuery),
    );
    const querySnapshot = await getDocs(q);
    
    if(querySnapshot.empty){
      return null;
    }

    let result = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      result.push({...doc.data(),  docID: doc.id});
    });
    return result.length > 0 ? result : null;
  } catch (error) {
    throw error;
  }
}
