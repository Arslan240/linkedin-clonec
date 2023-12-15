import { usePopper } from "react-popper";
import { Portal } from "../../../../components";
import { useEffect, useState } from 'react'
import "./CommentPortal.css"
import EmojiPicker from "emoji-picker-react";

// type CommentProps = {
//     elementRef: React.MutableRefObject<HTMLElement | null>,
//     handleEmojiClick: () => void;
// }

const CommentPortal = ({ open,setOpen,elementRef,handleEmojiClick,referenceElement}) => {

    // const [open, setOpen] = useState(false);
    const profileRef = elementRef;
    // const [referenceElement] = useState<HTMLElement | null>(null)
    const [popperElement, setpopperElement] = useState<HTMLElement | null>()
    const { styles, attributes } = usePopper(referenceElement, popperElement, { placement: "bottom-end" })

    useEffect(() => {
        const handlePopupClick = (event) => {
 
            if (!(popperElement?.contains(event.target) ||
                event.target === popperElement)
                &&
                !(profileRef.current?.contains(event.target) ||
                    event.target === profileRef.current)
            ) {
                // console.log(!(popperElement?.contains(event.target) ||
                    // event.target === popperElement))

                // console.log(!(profileRef.current?.contains(event.target) || event.target === profileRef.current))
                setOpen(false);
            }
        }
        window.addEventListener('mousedown', handlePopupClick)
        // window.addEventListener('keydown')
        if (!open) {
            window.removeEventListener('mousedown', handlePopupClick);
        }

        return () => window.removeEventListener('mousedown', handlePopupClick);
    },[open])
    return (
        <>
            <Portal idName="portal__comment_emoji">
                <div className={`comment__dialog ${open ? 'active' : 'inactive'}`}
                    ref={setpopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        lazyLoadEmojis={true}
                    />
                </div>
            </Portal>
        </>
    )
}
export default CommentPortal