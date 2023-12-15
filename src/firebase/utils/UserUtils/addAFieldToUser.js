import { USERS_COLL_NAME, db } from '../../firebase-config'
import { auth } from '../../firebase-config'
import { doc, setDoc } from 'firebase/firestore'

export const addAFieldToUser = async (fieldName, value) => {
    try {
        const docRef = doc(db, USERS_COLL_NAME, auth.currentUser.uid)
        await setDoc(docRef, { [fieldName]: value }, { merge: true })
    } catch (error) {
    }
}