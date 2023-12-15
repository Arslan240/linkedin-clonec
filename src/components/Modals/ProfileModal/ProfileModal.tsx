import { FieldValues, SubmitHandler,  useForm } from 'react-hook-form'
import { useState, useEffect,  } from 'react'
// import useProfileModal from '../../../hooks/useProfileModal'
import Modal from '../Modal'
import "./ProfileModal.css"
import useEducationModal from '../../../hooks/useEducationModal'
import Input from '../Input/Input'
// import useEditEducationModal from '../../../hooks/useEditEducationModal'
import useExperienceModal from '../../../hooks/useExperienceModal'
import {  UpdateUser, getUser } from '../../../firebase/utils'
import EducationContextProvider, { useEducation } from '../../../Context/EducationContext.jsx'
import ExperienceContextProvider, { useExperience } from '../../../Context/ExperienceContext.jsx'
import { SpinnerCircularFixed } from 'spinners-react'
import CountryPicker from '../CountryPicker.jsx'
import { AiOutlinePlusCircle } from 'react-icons/ai'


const firstNameID = "profile__firstname";
const lastNameID = "profile__lastname";
const headlineID = "profile__headline";
const countryID = "profile__country";
const cityID = "profile__city"

const ProfileModal = ({ isOpen, onClose }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [prevDataLoading, setPrevDataLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState({
    profile__firstname: "",
    profile__lastname: "",
    profile__headline: "",
    profile__country: "",
    profile__city: "",
  })

  const form = useForm<FieldValues>({
    defaultValues: defaultValues,
  })
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = form;



  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setSaveLoading(true);
      const userData = {
        firstname: data.profile__firstname,
        lastname: data.profile__lastname,
        headline: data.profile__headline,
        country: data.profile__country,
        city: data.profile__city,
      }

      console.log(userData)
      await UpdateUser(userData)
    } catch (error) {

    } finally {

      setSaveLoading(false);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const results = await getUser();
      const userData = results.data();
      const { firstName, lastName, headline, country, city } = userData;

      const newDefaultValues = {
        profile__firstname: firstName,
        profile__lastname: lastName,
        profile__headline: headline,
        profile__country: country,
        profile__city: city,
      }
      setDefaultValues(newDefaultValues);
      setPrevDataLoading(false);
      form.reset(newDefaultValues);
    }

    if (isOpen) {
      fetchUser();
    } else {
      form.reset(defaultValues);
    }

  }, [form, isOpen])

  useEffect(() => {

  }, [saveLoading])

  // console.log(defaultValues);


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Intro'
      isLoading={saveLoading}
      onSubmit={handleSubmit(onSubmit)}
    >
      {prevDataLoading ? <SpinnerCircularFixed size={40} color='var(--linkedin-blue)' /> :
        <div className="profile__modal__form__container">
          <div className="profile__modal__form">
            <div>
              <Input id={firstNameID} labelValue='First Name*' register={register} errors={errors} setValue={setValue} initialValue={getValues(firstNameID)} required />
            </div>

            <div>
              <Input id={lastNameID} labelValue='Last Name*' register={register} errors={errors} setValue={setValue} initialValue={getValues(lastNameID)} required />
            </div>

            <div>
              <Input id={headlineID} labelValue='Headline' register={register} errors={errors} setValue={setValue} initialValue={getValues(headlineID)} />
            </div>
          </div>



          {/* <button
            type='button'
            onClick={() => {
              onClose();
              editEducationModal.onOpen();
            }}
          >
            Edit new education
          </button> */}

        </div>
      }

      <div>
        {/* <Suspense fallback={<SpinnerCircularFixed color='var(--linkedin-blue)' size={40} />}> */}
        <EducationContextProvider>
          <EducationDetails profileOnClose={onClose} isLoading={saveLoading} />
        </EducationContextProvider>
        {/* </Suspense> */}
      </div>

      <div>
        {/* <Suspense fallback={<SpinnerCircularFixed color='var(--linkedin-blue)' size={40} />}> */}
        <ExperienceContextProvider  >
          <ExperienceDetails profileOnClose={onClose} isLoading={saveLoading} />
        </ExperienceContextProvider>
        {/* </Suspense> */}
      </div>

      <div>
        {!prevDataLoading &&
 
          <span className="modal__top__section__title modal__location__title">
            Location
          </span>
        }
        {!prevDataLoading &&
          <CountryPicker cityID={cityID} countryID={countryID} form={form} initialValues={{ country: getValues(countryID), city: getValues(cityID) }} />
        }

      </div>

    </Modal>
  )
}

export default ProfileModal


const EducationDetails = ({ profileOnClose, isLoading }) => {
  // @ts-ignore
  const { education } = useEducation()
  const educationModal = useEducationModal();
  
  console.log(education)

  return (

    <>
      {
        !education ? null : (
          <>
            <span className="modal__top__section__title modal__location__title">
              Education
            </span>

            <div>
              {education.map((item) => (
                <div className="profile__modal__activity__item">
                  <p>{item.school}</p>
                  <p>{item.degree}</p>
                </div>
              ))}
            </div>
            <div>
              <button
                className={`profile__add__activities`}
                disabled={isLoading}
                onClick={() => {
                  profileOnClose();
                  educationModal.onOpen();
                }}
              >
                <AiOutlinePlusCircle color="var(--linkedin-blue)" size="18" />
                Add new education
              </button>
            </div>
          </>
        )
      }
    </>
  )
}

const ExperienceDetails = ({ profileOnClose, isLoading }) => {
  // @ts-ignore
  const { experience } = useExperience()
  const experienceModal = useExperienceModal();
  // console.log(experience);
  // console.log(!experience)
  return (

    <>
      {
          <>
            <span className="modal__top__section__title modal__location__title">
              Current Position
            </span>
        
            {!experience ? null : (
              <div>
                {experience.map((item, index) => (
                  <>
                    <div key={item.docID} className="profile__modal__activity__item">
                      <p>{item.title}</p>
                      <p>{item.companyName}</p>
                    </div>
                    {experience.length > 1 && index === 0
                      ? <p className='profile__modal__additional__actitivites'>Previous Experiences</p>
                      : null
                    }
                  </>
                ))}
              </div>
            )}

            <div>
              <button
                className={`profile__add__activities`}
                disabled={isLoading}
                onClick={() => {
                  profileOnClose();
                  experienceModal.onOpen();
                }}
              >
                <AiOutlinePlusCircle color="var(--linkedin-blue)" size="18" />
                Add Experience
              </button>
            </div>
          </>
        
      }
    </>
  )
}