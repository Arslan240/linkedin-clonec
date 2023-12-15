import { usePopper } from "react-popper";
import { ProfileIcon, SeparaterLine } from "..";
import Portal from "../Portal";
import "./ProfileOption.css"
import { useEffect, useState, useRef } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'

import { auth } from "../../firebase/firebase-config.js"
import {useAuth} from '../../Context/AuthContext.jsx'
import { Link } from "react-router-dom";
import { capitalize } from "../../utils/index.js";

const ProfileOption = () => {
    const {userData} = useAuth();
    const {firstName, lastName, headline} = userData;
    const [open, setOpen] = useState(false);
    const profileRef = useRef<HTMLElement | null>(null);
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setpopperElement] = useState<HTMLElement | null>()
    const { styles, attributes } = usePopper(referenceElement, popperElement, { placement: "bottom-end" })

    const handleOpen = () => {
        setOpen(!open)
        // console.log(event.target);
    }

    useEffect(() => {
        const handlePopupClick = (event) => {
            // if(!popperElement || !profileRef.current) return;

            if (!(popperElement?.contains(event.target) ||
                event.target === popperElement)
                &&
                !(profileRef.current?.contains(event.target) ||
                    event.target === profileRef.current)
            ) {
                // console.log(!(popperElement?.contains(event.target) ||
                    // event.target === popperElement))
                setOpen(false);
            }
        }
        window.addEventListener('mousedown', handlePopupClick)
        if (!open) {
            window.removeEventListener('mousedown', handlePopupClick);
        }

        return () => window.removeEventListener('mousedown', handlePopupClick);
    },)


    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            throw error;
        }
        // await dispatch(logOut());
    }

    return (
        <>
            <div className={"profile__option"}
                onClick={handleOpen}
                ref={profileRef}
                // @ts-ignore
                ref={setReferenceElement}
                >
                <ProfileIcon imageURL="" name={`${firstName} ${lastName}`}/>
                <div className="profile__flex"
                    // onClick={handleOpen}
                >
                    <span
                        // onClick={handleOpen}
                        className="profileDown__span"
                    >
                        Me
                    </span>
                    <BiSolidDownArrow size={10}
                        // onClick={handleOpen} 
                        className="profileDown__icon" />
                </div>
            </div>
            <Portal idName="portal__signout">
                <div className={`profile__dialog ${open ? 'active' : 'inactive'}`}
                    ref={setpopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    {/* When i setup a separate component for ProfileDialog the opening and closing doesn't work due to problem in my logic in useEffect. So it's just hackaway to resolve the issue. Who knows it might turn up in this config too. */}
                    {/* <ProfileDialog/> */}
                    <div className="dialog__top__container dialog__container">
                        <Link to={`/in/${auth.currentUser.uid}`}>
                            <div className="dialog__profile__container">
                                <ProfileIcon height={55} name={`${firstName} ${lastName}`} imageURL=""/>
                                <div className="dialog__profile__details">
                                    <p className="dialog__profile__title">{`${capitalize(firstName)} ${capitalize(lastName)}`}</p>
                                    <p
                                    className="dialog__profile__description">{headline}</p>
                                </div>
                            </div>
                        </Link>
                        <Link to={`/in/${auth.currentUser.uid}`} className="dialog__btn__link">
                            <button className="dialog__view__profile__btn btn" onClick={() => setTimeout(() => setOpen(false), 150)}>View Profile</button>
                        </Link>
                    </div>
                    <SeparaterLine mt={2} mb={2} />
                    <div className="dialog__signOut__container dialog__container">
                        <p className="dialog__signOut" onClick={handleLogout}>Sign Out</p>
                    </div>
                </div>
            </Portal>
        </>
    )
}
export default ProfileOption