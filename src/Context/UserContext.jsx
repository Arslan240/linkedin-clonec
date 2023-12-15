import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";
import { getUser } from "../firebase/utils";


const UserContext = createContext()

const UserContextProvider = ({children}) => {
    // const {user, status, initialOnboarding} = useAuth()
    const [notifications, setNotifications] = useState([]);
    const [user, setUser] = useState();
    
    useEffect(() => {
      async function fetchUser() {
        try {
          const user = await getUser();
          if(!user.exists()){
            setUser(null);
          }
          const userData = user.data();
          setUser(userData);
        } catch (error) {
          throw error;
        }
      }
      fetchUser();
    }, [])

  return (
    <UserContext.Provider value={user}>
        {children}
    </UserContext.Provider>
  )
}
export default UserContextProvider

export const useUser = () => {
    const user = useContext(UserContext)
    return user;
}