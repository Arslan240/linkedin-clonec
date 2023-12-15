import { BsPlusCircle } from "react-icons/bs"
import { ProfileIcon } from "../../../../components"
import { capitalize } from "../../../../utils"
import { SendConnectRequest } from "../../../../firebase/utils"
import {auth, STATUS_PENDING, STATUS_ACCEPTED, STATUS_REJECTED} from '../../../../firebase/firebase-config.js'
import {useState, useEffect} from 'react'
import { AiFillMessage } from "react-icons/ai"
import { CiNoWaitingSign } from "react-icons/ci"
import { SpinnerCircularFixed } from "spinners-react"

const User = ({details, sent, reRender}) => {
    const {status} = sent || {status: ""};

    const {docID, firstName, lastName,} = details
    const [_firebaseError, setFirebaseError] = useState("")
    const [buttonDetails, setButtonDetails] = useState({})
    
    const [sendLoading, setSendLoading] = useState(false);


    useEffect(() => {
        let message = "";
        let icon;
        switch(status){
            case STATUS_PENDING:
                message = "Pending";
                icon = <CiNoWaitingSign size={18}/>
                break;
            case STATUS_ACCEPTED:
                message = "Message";
                icon = <AiFillMessage size={18}/>;
                break;
            case STATUS_REJECTED:
                // break;
            default:
                message = "Connect";
                icon = <BsPlusCircle size={18}/>
        }
        setButtonDetails({message, icon})
    },[status])

    useEffect(() => {
        // async function fetchUser(){
        //     try {
        //         const result = await getUser(docID);
                
        //     } catch (error) {
                
        //     }
        // }
    },[docID])

    const handleConnect = async () => {
        if(sent) return;
        try {
            setSendLoading(true);
            await SendConnectRequest(auth.currentUser.uid, docID)
            reRender();
        } catch (error) {
            setFirebaseError(error.message)
        }finally {
            setSendLoading(false);
        }
    }

    console.log("hello")
    return (
        <div className="search__results__actual__user">
            <div className="search__results__actual__user__container">
                <ProfileIcon height={50} name={`${capitalize(firstName)} ${capitalize(lastName)}`} imageURL=""/>
                <div className="search__results__user__details">
                    <p className="search__results__user__title">{`${capitalize(firstName)} ${capitalize(lastName)}`}</p>
                    <span className="search__results__user__desc margin__nt">Software Engineer</span>
                    <span className="search__results__user__desc margin__nt">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
                    <span className="search__results__time margin__nt">2d</span>
                </div>
            </div>
            <div className={`search__page__results__action`} onClick={handleConnect}>
                <div className="connect__message" >
                    <span>{buttonDetails["message"]}</span>
                    {buttonDetails["icon"]}
                    {sendLoading && 
                        <SpinnerCircularFixed size={25} color="var(--linkedin-in)" /> 
                    }
                </div>
            </div>
        </div>
    )
}
export default User

