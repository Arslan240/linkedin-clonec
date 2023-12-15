import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
// @ts-ignore
import { logOut, getAuthState } from "../../Context/authSlice.js"
import {useAuth} from '../../Context/AuthContext.jsx'
import { auth } from "../../firebase/firebase-config.js"
import { ProfileIcon, SeparaterLine } from ".."
import "./ProfileDialog.css"
import { capitalize } from "../../utils/index.js"

const ProfileDialog = () => {
  const dispatch = useDispatch();
  const {userData} = useAuth();
  const {firstName, lastName, headline} = userData;

  const handleLogout = async () => {
    try {
      // await auth.signOut();
      await dispatch(logOut());
    } catch (error:any) {
      throw error;
    }
  }
  return (
    <>
      <div className="dialog__top__container dialog__container">
        <Link to="">
          <div className="dialog__profile__container">
            <ProfileIcon name={`${userData.firstName} ${userData.lastName}`} height={55} imageURL=""/>
            <div className="dialog__profile__details">
              <p className="dialog__profile__title">{`${capitalize(firstName)} ${capitalize(lastName)}`} </p>
              <p className="dialog__profile__description">{headline}</p>
            </div>
          </div>
        </Link>
        <Link to={`/in/${auth.currentUser.uid}`} className="dialog__btn__link">
          <button className="dialog__view__profile__btn btn">View Profile</button>
        </Link>
      </div>
      <button>Auth User</button>
      <SeparaterLine mt={2} mb={2} />
      <div className="dialog__signOut__container dialog__container">
        <p className="dialog__signOut" onClick={handleLogout}>Sign Out</p>
      </div>
    </>
  )
}
export default ProfileDialog