
import { createContext, useContext, useEffect, useState } from "react";
import { AddExperience, GetExperience, getFirestoreTimestamp } from "../firebase/utils";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const defaultValues = {
  experience__modal__title: "",
  experience__modal__company: "",
  experience__modal__employmenttype: "",
  experience__modal__description: "",
  experience__modal__location: "",
  experience__modal__startdate: "",
  experience__modal__enddate: "",
}

// const titleID = "experience__modal__title"
// const companyID = "experience__modal__company"
// const companyLogoID = "experience__modal__company__logo"
// const employmentID = "experience__modal__employmenttype"
// const descripID = "experience__modal__description"
// const locationID = "experience__modal__location"
// const startDateID = "experience__modal__startdate"
// const endDateID = "experience__modal__enddate"

// @ts-ignore
const ExperienceContext = createContext()

const ExperienceContextProvider = ({ children }) => {
  const [experience, setExperience] = useState([]);
  const [noActivities, setNoActivities] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: defaultValues,
  })

  useEffect(() => {
    async function fetchExperience() {
      try {
        const results = await GetExperience();
        if (results === null) {
          setNoActivities(true);
        }
        setExperience(results);
        setNoActivities(false);
      } catch (error) {
        throw error;
      }
    }

    if (!saveLoading) fetchExperience();

  }, [saveLoading])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setSaveLoading(true);
      const userData = {
        title: data.experience__modal__title,
        companyName: data.experience__modal__company,
        mediaURL: data.experience__modal__company__logo,
        employmentType: data.experience__modal__employmenttype,
        description: data.experience__modal__description,
        location: data.experience__modal__location,
        startDate: getFirestoreTimestamp(data.experience__modal__startdate),
        endDate: getFirestoreTimestamp(data.experience__modal__enddate),
      }
      await AddExperience(userData);
      form.reset(defaultValues);

    } catch (error) {
      throw error;
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <ExperienceContext.Provider value={{ experience, form, onSubmit, noActivities, saveLoading }}>
      {children}
    </ExperienceContext.Provider>
  )
}
export default ExperienceContextProvider

export const useExperience = () => {
  const experience = useContext(ExperienceContext)
  return experience;
}