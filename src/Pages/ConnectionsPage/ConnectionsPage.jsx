import { useEffect, useState } from "react"
import { LoggedInPage } from "../../components"
import User from "../NetworkPage/NetworkDetailsPage/People/User"
import "./ConnectionsPage.css"
import { GetConnections, RemoveConnection } from "../../firebase/utils"
import { SpinnerCircularFixed } from "spinners-react"
import { auth } from "../../firebase/firebase-config"


const ConnectionsPage = () => {
    const [connections, setConnections] = useState([]);
    const [firebaseError, setFirebaseError] = useState("");
    const [noConnections, setNoConnections] = useState(false);
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false)


    const handleRemoveConnection = async (userID) => {
        try {
            // setRemoveConnectionLoading(true);
            await RemoveConnection(userID);
        } catch (error) {
        } 
        // finally {
        //     setShowConnectionsOptions(false);
        // }

    }

    useEffect(() => {
        async function fetchConnections(){
            try {
                const connResult = await GetConnections();
                if(connResult){
                    setConnections(connResult);
                }else{
                    setNoConnections(true);
                }
            } catch (error) {
                setFirebaseError({message:error.message, code: error.code});
            }
        }
        fetchConnections()
    },[deletedSuccessfully])

    
    
  return (
    <LoggedInPage>
        <div className="conns__page__left">
            <div className="conns__page__top__section section">
                <span className="connections_title">{connections.length} connections</span>
            </div>
            <div className="conns__page__conns__section section">
                {connections?.length > 0 ? 
                    connections.map((conn) => {
                        return (
                            <>
                                <User component={"connections"} details={conn}  
                                    handleRemoveConnection={handleRemoveConnection} 
                                    // showConnectionsOptions={showConnectionsOptions} 
                                    // setShowConnectionsOptions={setShowConnectionsOptions}
                                    // removeConnectionLoading={removeConnectionLoading} 
                                    // setRemoveConnectionLoading={setRemoveConnectionLoading}
                                    noConnections={noConnections}
                                    setDeletedSuccessfully={setDeletedSuccessfully}
                                />
                            </>
                        )
                    }) : noConnections ? <div>No connections available</div> : (
                        <SpinnerCircularFixed color="var(--linkedin-blue)"/>
                    )}
            </div>
        </div>
    </LoggedInPage>
  )
}
export default ConnectionsPage

