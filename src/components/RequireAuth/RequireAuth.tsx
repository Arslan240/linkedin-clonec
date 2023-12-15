// import { useSelector } from "react-redux"
import { useAuth,  LOGGED_IN,  IDLE } from "../../Context/AuthContext.jsx"
import { Navigate, useLocation } from "react-router-dom";
import { LoadingPage } from "../../Pages/index.js";
import NotificationsContextProvider from "../../Context/NotificationsContext.js";

const RequireAuth = ({ children }) => {
    const { user, status, fetchStatus, initialOnboarding } = useAuth();
    const location = useLocation();
    
    return !user 
        ? <Navigate to='/login' replace state={{ path: location.pathname }} />
        : user && !fetchStatus 
            ? <LoadingPage/>
            : initialOnboarding === false && status !== LOGGED_IN
                ? <Navigate to='/onboarding/name'/>
                : user && status !== IDLE && initialOnboarding !== undefined
                    ? (
                        <NotificationsContextProvider>
                            {children}
                        </NotificationsContextProvider>
                    )
                    : ""
}
export default RequireAuth