import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { USERS_COLL_NAME, auth, db } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { addIntialOnboardingAtSignup, addNewUserDocumentAtSignup } from '../firebase/utils';
import { addSearchTerms } from '../firebase/utils/SignupUtils/addSearchTerms';
import { getUser } from '../firebase/utils/getUser';

const AuthContext = createContext();

export const IDLE = 'idle'
export const LOADING = 'loading'
export const LOGGED_IN = 'succeeded'
export const LOGGED_OUT = 'logged_out'
export const FAILED = 'failed'
export const SIGNED_UP = 'signed_up'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(LOADING); // 'idle', 'loading', 'succeeded', 'failed', signed_up
  const [userData, setUserData] = useState();
  // new
  const [fetchStatus, setFetchStatus] = useState(false);
  const [initialOnboarding, setInitialOnboarding] = useState();
  const [error, setError] = useState({})

  //   First two useEffects are equivalents of checkAuthState from reducer implementation
  //   sets up user and status state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const signedInUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        setUser(signedInUser);
        // setStatus(LOGGED_IN);
      } else {
        setUser(null);
        setStatus(IDLE);
      }
    });

    return () => unsubscribe();
  }, []);

  // set up onboarding state when page loads
  useEffect(() => {
    const checkAuthState = async () => {
      if (user) {
        try {
          const user = await getUser()
          const userData = user.data();
          setUserData(userData);
          setInitialOnboarding(userData.initialOnboarding);
        } catch (error) {
          setFirebaseError(error)
        }
      }
    }
    checkAuthState();
  }, [user]);

  useEffect(() => {
    if (initialOnboarding === false) {
      setStatus(SIGNED_UP)
      // new
      setFetchStatus(true);
    } else if (initialOnboarding) {
      setStatus(LOGGED_IN)
      setFetchStatus(true);
    }
  }, [initialOnboarding])


  async function signUpWithEmailAndPassword(values) {
    try {
      const { email, password } = values;
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const { user: signedInUser } = userCredentials;
      const user = {
        uid: signedInUser.uid,
        email: signedInUser.email,
        displayName: signedInUser.displayName,
        photoURL: signedInUser.photoURL,
      };
      await addIntialOnboardingAtSignup(); //it adds initialOnboarding: false;
      setStatus(SIGNED_UP)
      setInitialOnboarding(false);
      return user;
    } catch (error) {
      setError({ message: error.message, code: error?.code })
    }
  }

  async function logInWithEmailAndPassword(values) {
    try {
      const { email, password } = values;
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const { user: signedInUser } = userCredentials;
      const user = {
        uid: signedInUser.uid,
        email: signedInUser.email,
        displayName: signedInUser.displayName,
        photoURL: signedInUser.photoURL,
      };
      setStatus(LOGGED_IN)
      return user;
    } catch (error) {
      setFirebaseError(error)
    }
  }

  async function logOut() {
    if (user) {
      try {
        await auth.signOut();
      } catch (error) {
        setFirebaseError(error)
      }
    }
  }

  async function completeSignup(user) {
    try {
      await addNewUserDocumentAtSignup(user)
      await addSearchTerms()
      setStatus(LOGGED_IN)
    } catch (error) {
      setFirebaseError(error)
    }
    finally{
    }
  }



  function setFirebaseError(firebaseError) {
    setError({ message: firebaseError.message, code: firebaseError?.code })
    setStatus(FAILED)
  }

  // async function getCurrentUser() {
  //   const docRef = doc(db, USERS_COLL_NAME, auth.currentUser.uid);
  //   const user = await getDoc(docRef);
  //   return user.data();
  // }

  const value = {
    user,
    userData,
    status,
    initialOnboarding,
    error,
    fetchStatus,
    setFirebaseError,
    signUpWithEmailAndPassword,
    logInWithEmailAndPassword,
    completeSignup
    // ...other functions and values you want to expose
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // if (context === undefined) {
  //   throw new Error('useAuth must be used within an AuthProvider');
  // }
  return context;
}
