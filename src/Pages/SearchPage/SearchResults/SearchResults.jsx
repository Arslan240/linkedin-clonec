import "./SearchResults.css"
import People from "./People/People"
import Post from "../../HomePage/Feed/Post/Post"
import PostRenderer from "./PostRenderer/PostRenderer"
// import { Post } from "../.."
// type Props = {}

const SearchResults = ({searchResults}) => {
console.log("search results")
  return (
    <>
      {/* <div > */}
        <div className="search__page__results">
          <div className="search__page__people__container">
            <People />
            {/* <div className="search__page__results_seeAll">
              See all people results
            </div> */}
          </div>
          {/* TODO: Wrap post component in PostRenderer in CommentContext before uncommenting it. And also implement a better searching algorithm. */}
          {/* <PostRenderer /> */}
        </div>
        {/* <div className="search__page__results"> */}
        {/* </div> */}
      {/* </div> */}
    </>

  )
}
export default SearchResults