import ReactDom from "react-dom"
import "./Modal.css"
import { IoCloseOutline } from "react-icons/io5";
import { SpinnerCircularFixed } from "spinners-react";

interface ModalProps {
  children?: React.ReactNode,
  title: string,
  isOpen: boolean,
  onClose: () => void,
  isLoading: boolean,
  onSubmit: () => void,
  prevOnOpen?: () => void,
}

const icon_size = 25;
const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, title, prevOnOpen, isLoading, onSubmit}) => {

  const handleClose = () => {
    onClose();
    prevOnOpen?.();
  }

  const handleSave = () => {
    if (isLoading) return;
    console.log("hello")
    onSubmit();
  }
  // console.log(isOpen)

  // if(!isOpen) return null;
  return ReactDom.createPortal(
    <div className="modal__container">
      <div className={`modal__overlay ${isOpen ? "display" : "display__none"}`} />

      <div className={`modal__modal ${isOpen ? "display" : "display__none"}`}>
        <div className="modal__top__section">
          <span className="modal__top__section__title">{title}</span>
          <IoCloseOutline className="close__icon icon" size={icon_size} onClick={handleClose} />
        </div>
        <div className="modal__middle__section">
          {children}
        </div>
        <div className="modal__bottom__section">
          <div>
            <button className='modal__button'
              onClick={isLoading ? undefined : handleSave}
              disabled={isLoading}
            >
              {isLoading
                ? <SpinnerCircularFixed size={30} color="var(--linkedin-blue)" />
                : "Save"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
    , document.body)
}
export default Modal