import "./NetworkDetailsPage.css"
import People from "./People/People"
// import PostRenderer from "./PostRenderer/PostRenderer"
// import { Post } from "../.."
// type Props = {}

const NetworkDetailsPage = ({searchResults}) => {
  return (
    <>
      {/* <div > */}
        <div className="networkPage__results">
          <div className="network__page__people__container">
            <People />
            {/* <div className="network__page__results_seeAll">
              See all Invitations<span>&nbsp;21</span>
            </div> */}
          </div>
          {/* <PostRenderer /> */}
        </div>
        {/* <div className="network__page__results"> */}
        {/* </div> */}
      {/* </div> */}
    </>

  )
}
export default NetworkDetailsPage