import Modal from '../Modals/Modal'
import useEducationModal from '../../hooks/useEducationModal'
import { useEducation } from '../../Context/EducationContext';
import Input from '../Modals/Input/Input';

// const defaultValues = {
//   education__modal__school: "",
//   education__modal__school_link: "",
//   education__modal__degree: "",
//   education__modal__description: "",
//   education__modal__startdate: "",
//   education__modal__enddate: "",
// }

const schoolID = "education__modal__school"
const schoolLogoID = "education__modal__school__logo"
const degreeID = "education__modal__degree"
const descripID = "education__modal__description"
const startDateID = "education__modal__startdate"
const endDateID = "education__modal__enddate"


interface EducationModalProps {
  /**
   * an onOpen function of a modal which was previously open before opening this modal. When this modal is closed, prev Modal will be opened by calling this function.
   * @returns void
   */
  prevOnOpen?: () => void;
}
const EducationModal: React.FC<EducationModalProps> = ({ prevOnOpen }) => {
  // const [isSaved, setIsSaved] = useState(false);
  //@ts-ignore
  const {saveLoading, form, onSubmit} = useEducation();
  const { isOpen, onClose } = useEducationModal();

  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;


  // useEffect(() => {
  //   if (isSaved) {
  //     form.reset(defaultValues);
  //   }
  // }, [form, isSaved])

  return (
    <Modal
      title='Education'
      isOpen={isOpen}
      onClose={onClose}
      prevOnOpen={prevOnOpen}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={saveLoading}
    >
      <div className="profile__modal__form">
        <div>
          <Input labelValue='School*' errors={errors} id={schoolID} register={register} setValue={setValue} placeholder='Ex: Boston University' required />
        </div>
        <div>
          <Input labelValue='School Logo link' errors={errors} id={schoolLogoID} register={register} setValue={setValue} placeholder='Ex: https://somewebsite.com/content/logo.png' />
        </div>
        <div>
          <Input labelValue='Degree' errors={errors} id={degreeID} register={register} setValue={setValue} placeholder='Ex: Bachelors' required/>
        </div>
        <div>
          <Input labelValue='Description' errors={errors} id={descripID} register={register} setValue={setValue} />
        </div>
        <div id='education__modal__dates__container'>
          <div className='educational__modal__date'>
            <Input labelValue='Start Date*' errors={errors} id={startDateID} register={register} setValue={setValue} type='date' watch={watch} required />
          </div>
          <div className='educational__modal__date'>
            <Input labelValue='End Date*' errors={errors} id={endDateID} register={register} setValue={setValue} type='date' watch={watch} required />
          </div>
        </div>
      </div>
    </Modal>
  )
}
export default EducationModal