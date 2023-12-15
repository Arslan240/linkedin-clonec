import { BsFillPersonFill, BsPeopleFill } from "react-icons/bs"
import "./NetworkPageLeft.css"
import { useState } from "react"
import { Link } from "react-router-dom"

const posts = "posts"
const people = "people"
const icon_size = 20;

const NetworkPageLeft = () => {
  const [active, setActive] = useState("");
  return (
    <div className="network__page__left">
      <div className="network__page__card">
        <div className="network__page__container">
          <div className="stats" >
            <Link to="/mynetwork/connections" className={`network__item__type ${active === people && people}`} onClick={() => setActive(people)}>
              <BsPeopleFill size={icon_size}/>
              <span>Connections</span>
            </Link>
            <Link to="/mynetwork/follow_manager" className={`network__item__type ${active === posts && posts}`} onClick={() => setActive(posts)}>
              <BsFillPersonFill size={icon_size}/>
              <span>Following and Followers</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="network__page__card">

      </div>
    </div>
  )
}
export default NetworkPageLeft