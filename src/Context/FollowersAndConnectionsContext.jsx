import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { auth } from "../firebase/firebase-config";


const FollowerAndConnsContext = createContext()

const FollowAndConnsProvider = ({children}) => {
    const [followers, setFollowers] = useState([]);
    const [connections, setConnections] = useState([]);

    useEffect(() => {
      // if(!auth.currentUser) return;
    })

  return (
    <FollowerAndConnsContext.Provider value={{followers,connections}}>
        {children}
    </FollowerAndConnsContext.Provider>
  )
}
export default FollowAndConnsProvider

export const useFoll = () => {
    const user = useContext(FollowerAndConnsContext)
    return user;
}