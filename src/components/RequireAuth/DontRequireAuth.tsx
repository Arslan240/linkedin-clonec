import { useAuth } from '../../Context/AuthContext.jsx'
import { Navigate } from "react-router-dom"

const DontRequireAuth = ({ children }) => {
    const { user } = useAuth();

    return user ? (<Navigate to="/feed" />) : (children)
}
export default DontRequireAuth