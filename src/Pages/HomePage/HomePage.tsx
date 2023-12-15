import { Feed, HomeSidebarLeft, HomeSidebarRight } from ".."
import "./HomePage.css"

// type Props = {}

const HomePage = () => {
  return (
    <div className="homePage">
        <HomeSidebarLeft/>
        <Feed/>
        <HomeSidebarRight/>
    </div>
  )
}
export default HomePage