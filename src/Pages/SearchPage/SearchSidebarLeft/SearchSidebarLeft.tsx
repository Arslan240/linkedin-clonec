
import "./SearchSidebarLeft.css"
import { useState } from "react"
// type Props = {}
const posts = "posts"
const people = "people"
const SearchSidebarLeft = () => {
  const [active, setActive] = useState("");
  return (
    <div className="search__sidebar__left">
      <div className="search__sidebar__card">
        <div className="search__sidebar__container">
          <div className="stats" >
            <div className={`search__item__type ${active === people && people}`} onClick={() => setActive(people)}>
              <span>People</span>
            </div>
            <div className={`search__item__type ${active === posts && posts}`} onClick={() => setActive(posts)}>
              <span>Posts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search__sidebar__card">

      </div>
    </div>
  )
}
export default SearchSidebarLeft