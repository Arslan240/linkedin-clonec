import { useEffect, useState } from "react";
import "./People.css"
import User from "./User";
import { useLocation } from "react-router-dom";
import { GetSentRequests, SearchUserFromFirebase } from "../../../../firebase/utils";
import { auth } from '../../../../firebase/firebase-config.js'
import { SpinnerCircularFixed } from "spinners-react";
import { useSearch } from "../../../../Context/SearchContext.js";


const People = () => {
    const [searchResult, setSearchResult] = useState([]);

    const {searchLoading,setSearchLoading} = useSearch();
    
    const [reRenderState, setRerender] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query")

    const [sentRequests, setSentRequests] = useState([])

    function reRender(){
        setRerender(!reRenderState);
    }

    // TODO: according to new algorithm, when a request is accepted, it is deleted from sent_requests, instead of just changing it's status to accepted. So get connections collection and compare if the user is present in that. If user is present then you show message instead of connect or pending.
    useEffect(() => {
        async function updateSentRequests(){
            const requests = await GetSentRequests();
            if(requests){
                const receiverIDS = requests.map(({receiverID, status}) => {
                    return {receiverID, status};
                })
                setSentRequests(receiverIDS);
            }
        }
        updateSentRequests()
    },[reRenderState])

    useEffect(() => {
        async function performSearch(query) {
            try {
                const result = await SearchUserFromFirebase(query);
                setSearchResult(result);
            } catch (error) {
            }finally {
                setSearchLoading(false);
            }
        }
        performSearch(query)
    }, [query])

    useEffect(() => {
    })

    return (
        <>
            {searchLoading ? (
                <div className="search__people__loader">
                    <SpinnerCircularFixed color="var(--linkedin-blue)"/>
                </div>
            ) :  (
                <>
                    <div className="search__page__results__title">People</div>
                    {
                        searchResult !== null 
                        ? searchResult.length > 0 && searchResult.map((result) => {
                            if(result.docID === auth.currentUser.uid) return; //loggedin user itself

                            return <User details={result} key={result.docID} sent={sentRequests.find((request) => result.docID === request.receiverID)} reRender={reRender}/>
                        })
                        : (<div>No user found for {query}</div>)
                    }
                    {/* <User /> */}
                </>
            )}
        </>
    )
}
export default People
