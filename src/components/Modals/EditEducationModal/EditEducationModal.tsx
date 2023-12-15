import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Modal from "../../../components/Modals/Modal"
import useEditEducationModal from "../../../hooks/useEditEducationModal"
import "./EditEducationModal.css"
import {useState} from 'react'

const defaultValues = {

}

type EditEducationModalProps = {
  prevOnOpen?: () => void
}
const EditEducationModal:React.FC<EditEducationModalProps> = ({prevOnOpen}) => {
  const [isLoading] = useState(false);
  const {isOpen,onClose} = useEditEducationModal();
  const { handleSubmit} = useForm<FieldValues>({
    defaultValues: defaultValues
  })

  const onSubmit: SubmitHandler<FieldValues> = () => {
    
  }
  

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Education"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      onClose={onClose}
      prevOnOpen={prevOnOpen}
    >
      <h2>Edit Education Modal</h2> 
    </Modal>
  )
}
export default EditEducationModal