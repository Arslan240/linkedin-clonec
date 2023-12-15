import { ProfileIcon } from "../../../../components"
import "./CreatePost.css"
import PostModal from "./PostModal.jsx"
import { useAuth } from '../../../../Context/AuthContext.jsx'
import { useEffect, useState } from 'react'
import { HiMiniPhoto } from 'react-icons/hi2'
import { IoLogoYoutube } from 'react-icons/io'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { MdOutlineArticle } from 'react-icons/md'

const large_icon = 22;
const small_icon = 18;

function CreatePost({ setPostAdded }) {
    const [isOpen, setIsOpen] = useState(false)
    const [iconSize, setIconSize] = useState(small_icon);
    const { userData } = useAuth()
    const { firstName, lastName } = userData;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 412) {
                setIconSize(large_icon);
            } else {
                setIconSize(small_icon);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])

    return (
        <>
            {/* <div style={BUTTON_WRAPPER_STYLES} onClick={}>
          <button onClick={() => setIsOpen(true)}>Open Modal</button>
  
          <PostModal open={isOpen} onClose={() => setIsOpen(false)}/>
        </div>
  
        Hello World */}
            <div className="createPost">
                <div className="createPost__startContainer">
                    <ProfileIcon height={48} name={`${firstName} ${lastName}`} imageURL="" />
                    <button
                        className="createPost__startPost"
                        onClick={() => setIsOpen(true)}
                    >
                        Start a Post
                    </button>
                    <PostModal open={isOpen} onClose={() => setIsOpen(false)} setPostAdded={setPostAdded} />
                </div>

                <div className="createPost__mediaContainer">
                    <div className="media__type"
                        onClick={() => setIsOpen(true)}
                    >
                        <HiMiniPhoto
                            size={iconSize}
                            className="photo" />
                        <span>Photo</span>
                    </div>
                    <div className="media__type"
                        onClick={() => setIsOpen(true)}
                    >
                        <IoLogoYoutube
                            size={iconSize}
                            className="video" />
                        <span>Video</span>
                    </div>
                    <div className="media__type event"
                        onClick={() => setIsOpen(true)}
                    >
                        <FaRegCalendarAlt
                            size={iconSize}
                            className="event" />
                        <span>Event</span>
                    </div>
                    <div className="media__type article"
                        onClick={() => setIsOpen(true)}
                    >
                        <MdOutlineArticle
                            size={iconSize}
                            className="article" />
                        <span>Article</span>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CreatePost