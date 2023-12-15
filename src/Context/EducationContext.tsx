import { createContext, useContext, useEffect, useState } from "react";
import { AddEducation, GetEducation, getFirestoreTimestamp } from "../firebase/utils";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const defaultValues = {
  education__modal__school: "",
  education__modal__school_link: "",
  education__modal__degree: "",
  education__modal__description: "",
  education__modal__startdate: "",
  education__modal__enddate: "",
}

// @ts-ignore
const EducationContext = createContext()

const EducationContextProvider = ({ children }) => {
  const [education, setEducation] = useState([]);
  const [noActivities, setNoActivities] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const form = useForm<FieldValues>({
    defaultValues: defaultValues,
  })



  useEffect(() => {
    async function fetchEducation() {
      try {
        const results = await GetEducation();
        if(!results){
          setNoActivities(true);
          return;
        }
        setEducation(results);
      } catch (error) {
        throw error;
      }
    }
    if(!saveLoading){
      fetchEducation();
    }
  }, [saveLoading])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setSaveLoading(true);
      const userData = {
        school: data.education__modal__school,
        mediaURL: data.education__modal__school__logo,
        degree: data.education__modal__degree,
        description: data.education__modal__description,
        startDate: getFirestoreTimestamp(data.education__modal__startdate),
        endDate: getFirestoreTimestamp(data.education__modal__enddate),
      }
      await AddEducation(userData)
      form.reset(defaultValues);
    } catch (error) {
      throw error;
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <EducationContext.Provider value={{ education, noActivities, form, saveLoading, onSubmit }}>
      {children}
    </EducationContext.Provider>
  )
}
export default EducationContextProvider

export const useEducation = () => {
  const education = useContext(EducationContext)
  return education;
}