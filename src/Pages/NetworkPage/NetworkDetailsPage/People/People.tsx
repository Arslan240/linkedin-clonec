import { useEffect, useState } from "react";
import "./People.css"
import User from "./User";
// import { useLocation } from "react-router-dom";
import { GetReceivedRequestsOfLoggedinUser } from "../../../../firebase/utils";
import { auth } from '../../../../firebase/firebase-config.js'
import { SpinnerCircularFixed } from "spinners-react";


const People = () => {
    const [isLoading, setIsLoading] = useState(true);
    // const [reRenderState, setRerender] = useState(true);
    const [invitationsResult, setInvitationsResult] = useState([])

    // TODO: when the page is loaded set the read option of all notifications i.e. which are loaded, to true;

    useEffect(() => {
        async function performFunction(){
            const requests = await GetReceivedRequestsOfLoggedinUser();
            setInvitationsResult(requests);
            setIsLoading(false)
        }
        performFunction()
    }, [])

    
    return (
        <>
            {isLoading ? (
                <div className="network__page__loader">
                    <SpinnerCircularFixed color="var(--linkedin-blue)"/>
                </div>
            ) :  (
                <>
                    <div className="network__page__results__title">Requests</div>
                    {
                        invitationsResult ? 
                        invitationsResult.length > 0 && invitationsResult.map((result) => {
                            if(result.docID === auth.currentUser.uid) return; //loggedin user itself

                            // @ts-ignore
                            return <User details={result} key={result.docID} />
                        })
                        : <div>No New Requests</div>
                    }
                    {/* <User /> */}
                </>
            )}
            {/* {invitationsResult && (
                <div className="network__page__results_seeAll">
                    See all Requests<span>&nbsp;21</span>
                </div>
            )} */}
        </>
    )
}
export default People


// const UserRenderer = () => {
//   return (
    
//   )
// }