import Modal from '../Modal'
// import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
// import { useState, useEffect } from 'react';
import Input from '../Input/Input';
// import { AddExperience, getFirestoreTimestamp } from '../../../firebase/utils';
import useExperienceModal from '../../../hooks/useExperienceModal';
import CountryPicker from '../CountryPicker';
import { useExperience } from '../../../Context/ExperienceContext';


const titleID = "experience__modal__title"
const companyID = "experience__modal__company"
const companyLogoID = "experience__modal__company__logo"
const employmentID = "experience__modal__employmenttype"
const descripID = "experience__modal__description"
const locationID = "experience__modal__location"
const startDateID = "experience__modal__startdate"
const endDateID = "experience__modal__enddate"


interface ExperienceModalProps {
  /**
   * an onOpen function of a modal which was previously open before opening this modal. When this modal is closed, prev Modal will be opened by calling this function.
   * @returns void
   */
  prevOnOpen?: () => void;
}
const ExperienceModal: React.FC<ExperienceModalProps> = ({ prevOnOpen }) => {
  // const [saveLoading, setSaveLoading] = useState(false);
  // @ts-ignore  
  const { isOpen, onClose, onOpen } = useExperienceModal();
  // @ts-ignore
  const {saveLoading, form, onSubmit} = useExperience();
  // const form = useForm<FieldValues>({
  //   defaultValues: defaultValues,
  // })
  const { register, handleSubmit, watch, setValue,  formState: { errors } } = form;


  // const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  //   // console.log(data)
  //   try {
  //     setSaveLoading(true);
  //     // console.log(data)
  //     const userData = {
  //       title: data.experience__modal__title,
  //       companyName: data.experience__modal__company,
  //       employmentType: data.experience__modal__employmenttype,
  //       description: data.experience__modal__description,
  //       location: data.experience__modal__location,
  //       startDate: getFirestoreTimestamp(data.experience__modal__startdate),
  //       endDate: getFirestoreTimestamp(data.experience__modal__enddate),
  //     }
  //     console.log(userData)
  //     await AddExperience(userData);
  //     form.reset(defaultValues);
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     setSaveLoading(false);
  //   }
  // }



  // console.log(getValues(schoolID))
  // console.log(getValues(degreeID))
  // console.log(getValues(descripID))
  // console.log(getValues(startDateID))


  return (
    <Modal
      title='Experience'
      isOpen={isOpen}
      onClose={onClose}
      prevOnOpen={prevOnOpen}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={saveLoading}
    >
      <div className="profile__modal__form">
        <div>
          <Input labelValue='Title*' errors={errors} id={titleID} register={register} setValue={setValue} placeholder='Ex: Retails Manager' required />
        </div>
        <div>
          <Input labelValue='Employment type' errors={errors} id={employmentID} register={register} setValue={setValue} placeholder='Ex: Full time, Part time, Internship' />
        </div>
        <div>
          <Input labelValue='Company name*' errors={errors} id={companyID} register={register} setValue={setValue} placeholder='Ex: Microsoft' required />
        </div>
        <div>
          <Input labelValue='Company logo url' errors={errors} id={companyLogoID} register={register} setValue={setValue} placeholder='Ex: Microsoft'/>
        </div>
        <div>
          <Input labelValue='Description' errors={errors} id={descripID} register={register} setValue={setValue} />
        </div>

        <CountryPicker form={form} countryID={locationID} onlyCountry={true} initialValues={{ country: "" }} />

        <div id='education__modal__dates__container'>
          <div className='educational__modal__date'>
            <Input labelValue='Start Date*' errors={errors} id={startDateID} register={register} setValue={setValue} type='date' watch={watch} required />
          </div>
          <div className='educational__modal__date'>
            <Input labelValue='End Date' errors={errors} id={endDateID} register={register} setValue={setValue} type='date' watch={watch} />
          </div>
        </div>

      </div>
    </Modal>
  )
}
export default ExperienceModal