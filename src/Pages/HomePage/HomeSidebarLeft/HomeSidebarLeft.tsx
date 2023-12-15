import { ProfileIcon } from "../../../components"
// import { BsFillBookmarkFill } from "react-icons/bs"
import {useAuth} from '../../../Context/AuthContext.jsx'
import "./HomeSidebarLeft.css"
import { Link } from "react-router-dom"
import {auth} from '../../../firebase/firebase-config.js'
import { capitalize } from "../../../utils/index.js"
// type Props = {}
const HomeSidebarLeft = () => {
  const {userData} = useAuth();
  const {headline, firstName, lastName} = userData;
  return (
    <div className="sidebar__left">
      {/* HomeSidebarLeft */}
      {/* TODO: add banner image as background of this div */}
      <div className="sidebar__card">
        <div className="sidebar__banner"></div>
        <div className="sidebar__container">
          <div className="sidebar__profile">
            <ProfileIcon height={60} name={`${capitalize(firstName)} ${capitalize(lastName)}`}  imageURL=""/>
            {/* TODO: ADD a dynamic route to yourself, maybe have a property  */}
            <Link to={`/in/${auth.currentUser.uid}`} className="link"><p>{`${capitalize(firstName)} ${capitalize(lastName)}`}</p></Link>
            <div className="sidebar__profile__description">
              {headline}
            </div>
          </div>
        </div>
{/*         
        <div className="sidebar__container">
          <div className="stats">
            <div className="stat">
              <span>Who's viewed your profile</span>
              <span className="stat__number">48</span>
            </div>
            <div className="stat">
              <span>Impressions of your post</span>
              <span className="stat__number">2,111</span>
            </div>
          </div>
        </div>
        <div className="sidebar__container">
          <div className="sidebar__items">
            <BsFillBookmarkFill className="sidebar__itemIcon" size={17}/>
            <span className="sidebar__item__text">My items</span>
          </div>
        </div> */}
      </div>

      {/* <div className="sidebar__card">

      </div> */}
    </div>
  )
}
export default HomeSidebarLeft