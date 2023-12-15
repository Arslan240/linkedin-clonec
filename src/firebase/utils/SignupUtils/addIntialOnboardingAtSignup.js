import { USERS_COLL_NAME, db } from '../../firebase-config'
import { auth } from '../../firebase-config'
import { doc, setDoc } from 'firebase/firestore'

export const addIntialOnboardingAtSignup = async () => {
    
    try {
        const docRef = doc(db, USERS_COLL_NAME, auth.currentUser.uid)
        await setDoc(docRef, { initialOnboarding: false }, { merge: true })
    } catch (error) {
        throw error
    }
}