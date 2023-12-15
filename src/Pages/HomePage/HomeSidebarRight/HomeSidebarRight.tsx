import { ProfileIcon } from "../../../components"
import "./HomeSidebarRight.css"
import {AiOutlinePlus} from 'react-icons/ai'
// type Props = {}
const HomeSidebarRight = () => {
  return (
    <div className="sidebar__right">
      <div className="right__topContainer">
        <span className="topContainer__title">Add to your feed</span>
        <span></span>
      </div>
      <div className="sidebar__right__companies">
        <div className="company">
          <ProfileIcon height={45}/>
          <div className="company__details">
            <span className="company__title">ZAPTA Technologies (PVT.) Limited</span>
            <span className="company__type__category">Company . <span>Computer Software</span></span>
            <div className="follow__button">
              <AiOutlinePlus/>
              <span>Follow</span>
            </div>
          </div>
        </div>
        <div className="company">
          <ProfileIcon height={45}/>
          <div className="company__details">
            <span className="company__title">ZAPTA Technologies Limited</span>
            <span className="company__type__category">Company . <span>Computer Software</span></span>
            <div className="follow__button">
              <AiOutlinePlus/>
              <span>Follow</span>
            </div>
          </div>
        </div>
        <div className="company">
          <ProfileIcon height={45}/>
          <div className="company__details">
            <span className="company__title">ZAPTA Technologies</span>
            <span className="company__type__category">Company . <span>Computer Software</span></span>
            <div className="follow__button">
              <AiOutlinePlus/>
              <span>Follow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomeSidebarRight