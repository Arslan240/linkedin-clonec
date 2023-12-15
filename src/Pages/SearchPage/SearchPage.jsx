import { useLocation } from "react-router-dom"
import "./SearchPage.css"
import { useEffect, useState } from "react";
import { SearchUserFromFirebase } from "../../firebase/utils";
import { LoadingPage } from "../";
import SearchResults from './SearchResults/SearchResults'
import SearchSidebarLeft from './SearchSidebarLeft/SearchSidebarLeft'


const SearchPage = () => {
    // const [isLoading, setIsLoading] = useState(true);
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const query = queryParams.get("query")

    // useEffect(() => {
        // async function performSearch(query) {
        //     try {
        //         const result = await SearchUserFromFirebase(query);
        //         if(result) setSearchResult(result);
        //         setIsLoading(false);
        //     } catch (error) {
        //     }
        // }
        // performSearch(query)
    // }, [query])


    return (
        <div className="search__page">
            <SearchSidebarLeft />
            <SearchResults/>
        </div>
    )
    // return isLoading ? <LoadingPage /> : (
    //     <div className="search__page">
    //         <SearchSidebarLeft />
    //         <SearchResults searchResult={searchResult}/>
    //         {/* <SearchSidebarRight /> */}
    //     </div>
    // )
}
export default SearchPage