import { Field, useFormik, FormikProvider } from "formik"
import * as yup from "yup"
import "./screens.css"
import { useContext, useState, useEffect } from "react";
import { FormContext } from "..";
import { useNavigate } from "react-router-dom";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { SpinnerCircularFixed } from "spinners-react";
import { addNewUserDocumentAtSignup } from "../../firebase/utils";
import { useAuth } from "../../Context/AuthContext";
import { ACC_TYPE_JOB_HOLDER, ACC_TYPE_STUDENT } from "../../firebase/firebase-config";

const currentYear = new Date().getFullYear();
const startYearOptions = Array.from({ length: currentYear - 1963 }, (_, index) => currentYear - index);
const endYearOptions = Array.from({ length: currentYear - 1963 + 5 }, (_, index) => 1964 + index).reverse();
//TODO: fetch actual companies from the firebase when user enters something in input and show it as drop down.
const jobTypeOptions = ["Full time", "Part time", "Internship", "Owner", "Contract based"]
const companyOptions = ["Full time", "Part time", "Internship", "Owner", "Contract based"]


const step_one_IV = {
    signup__firstName: "",
    signup__lastName: "",
}
const step_two_IV = {
    signup__country: "",
    signup__city: "",
}
const step_three_JobIV = {
    signup__jobTitle: "",
    signup__jobType: "",
    signup__company: "",
}
const step_three_StudentIV = {
    signup__schoolName: "",
    start__year__school: currentYear,
    end__year__school: currentYear + 5,
}

const getInitialValues = (step, isStudent) => {
    switch (step) {
        case 0:
            return step_one_IV;
            break;
        case 1:
            return step_two_IV;
            break;
        case 2:
            return isStudent ? step_three_StudentIV : step_three_JobIV;
            break;
        default:
            return {};
    }
}

const getValidationSchema = (step, isStudent) => {
    switch (step) {
        case 0:
            return step_one_nameSchema;
            break;
        case 1:
            return step_two_regionSchema;
            break;
        case 2:
            return isStudent ? step_three_studentSchema : step_three_jobSchema
            break;
        default:
            return {};
    }
}




const step_one_nameSchema = yup.object().shape({
    signup__firstName: yup.string().required("Firstname is required").min(3, "First name should be atleast 3 characters long"),
    signup__lastName: yup
        .string()
        .min(2, "Last name should be atleast 2 characters long")
        .required("last name is required"),
})
const step_two_regionSchema = yup.object().shape({
    signup__country: yup.string().required("Country is required"),
    signup__city: yup.string().required("City is required"),
})
const step_three_jobSchema = yup.object().shape({
    signup__jobTitle: yup.string().required("Job title is required"),
    signup__jobType: yup.string().required("Job type is required"),
    signup__company: yup.string().required("Company name is required"),
})
const step_three_studentSchema = yup.object().shape({
    signup__schoolName: yup.string().required("School name is required"),
    start__year__school: yup.string().required("Start year is required"),
    end__year__school: yup.string().required("End year is required"),

})



const Screen1Name = () => {
    // const [showError, setShowError] = useState(false);
    // const [errorMessage, setErrorMessage] = useState(null);
    const { completeSignup } = useAuth()
    const navigate = useNavigate();
    let { SignupFormState, setSignupFormState } = useContext(FormContext)
    const { firstName } = SignupFormState;
    const [step, setStep] = useState(0);
    const [isStudent, setIsStudent] = useState(false);
    const [isDocAdding, setIsDocAdding] = useState(false);
    const totalSteps = 3;

    //TODO: if need to show any firebase error then show them here.
    // useEffect(()=>{

    // },[])

    function isLastStep() {
        return step === totalSteps - 1;
    }

    async function submitHandler(values, actions) {
        // event?.preventDefault()
        // if(!isSubmitting) return;
        if (isSubmitting && isLastStep()) {
            // if(isStudent && values?.signup__jobTitle || values?.signup__jobType || values?.signup__company){
            if (isStudent) {
                const { signup__schoolName, start__year__school, end__year__school, signup__firstName, signup__lastName, signup__country, signup__city } = values;

                setIsDocAdding(true)
                await completeSignup({
                    firstName: signup__firstName.toLowerCase(),
                    lastName: signup__lastName.toLowerCase(),
                    country: signup__country,
                    city: signup__city,
                    schoolName: signup__schoolName.toLowerCase(),
                    startYear: start__year__school.toLowerCase(),
                    endYear: end__year__school.toLowerCase(),
                    initialOnboarding: true,
                    accountType: ACC_TYPE_STUDENT
                })
                actions.setIsSubmitting(false)
                setIsDocAdding(false)
                navigate('/feed')
            } else if (!isStudent) {
                const { signup__jobTitle, signup__jobType, signup__company, signup__firstName, signup__lastName, signup__country, signup__city } = values;
                setIsDocAdding(true)
                await completeSignup({
                    firstName: signup__firstName.toLowerCase(),
                    lastName: signup__lastName.toLowerCase(),
                    country: signup__country,
                    city: signup__city,
                    company: signup__company.toLowerCase(),
                    jobTitle: signup__jobTitle.toLowerCase(),
                    jobType: signup__jobType.toLowerCase(),
                    initialOnboarding: true,
                    accountType: ACC_TYPE_JOB_HOLDER,
                })
                setIsDocAdding(false)
                actions.setSubmitting(false)
                navigate('/feed')
            }
            actions.resetForm();
        }

        if (isLastStep()) {
            setTimeout(() => {
                actions.resetForm();
            }, 500); // Adjust the delay as needed, 500ms should be sufficient in most cases.
        } else {
            // Move to the next step
            setStep((prevStep) => prevStep + 1);
        }
    }


    const formik = useFormik({
        initialValues: getInitialValues(step, isStudent),
        validationSchema: getValidationSchema(step, isStudent),
        onSubmit: submitHandler
    });

    const { values, errors, touched, isValid, dirty, handleBlur, handleChange, handleSubmit, isSubmitting } = formik;

    const handleStudent = () => {
        setIsStudent(!isStudent);
    }


    const titlesArray = [
        <div className="signup__step__title">
            <h1 className='login__title'>Make the most of your professional life</h1>
        </div>
        ,
        <div className="signup__step__title">
            <h1 className='login__title'>Welcome {firstName || "Username"}! What's your location?</h1>
            <span className="signup__title__description">See people, jobs and news in your area</span>
        </div>
        ,
        <div className="signup__step__title"><h1 className="login__title">Your profile helps you discover new people and opportunities</h1></div>
        ,
    ]


    const { initialOnboarding } = useAuth();
    useEffect(() => {
        if (initialOnboarding !== false) navigate('/feed');
    }, [])


    return (
        <FormikProvider value={formik}>
            <div className="screen__name">
                <div className="login__inputsContainer">

                    {titlesArray[step]}

                    <form className='login__form' onSubmit={handleSubmit}
                    >
                        {step === 0 ? (
                            <FormikStep>
                                <div>
                                    <label htmlFor="signup__firstName">First Name</label>
                                    <input
                                        value={values.signup__firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type='text'
                                        id='signup__firstName'
                                        className={errors.signup__firstName && touched.signup__firstName ? "input__error" : ''}
                                    />
                                    {errors.signup__firstName && touched.signup__firstName &&
                                        <p className='login__error'>{errors.signup__firstName}</p>
                                    }
                                </div>
                                <div>
                                    <label htmlFor="signup__lastName">Last Name</label>
                                    <div className="signup__lastName">
                                        <input
                                            value={values.signup__lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            id="signup__lastName"
                                            className={errors.signup__lastName && touched.signup__lastName ? "input__error" : ''}
                                        />
                                    </div>
                                    {errors.signup__lastName && touched.signup__lastName &&
                                        <p className='login__error'>{errors.signup__lastName}</p>
                                    }
                                </div>
                            </FormikStep>
                        ) : step === 1 ? (
                            <FormikStep>
                                <div>
                                    <label htmlFor="signup__country">Country/Region<span className="asterik">*</span></label>
                                    <Field name="signup__country">
                                        {({
                                            field: { onBlur, value }, // { name, value, onChange, onBlur }
                                            form: { setFieldValue, setFieldTouched, errors, touched, values }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                            meta,
                                        }) => {

                                            return (
                                                <div>
                                                    <CountryDropdown
                                                        // Pass the field's onChange and onBlur functions
                                                        onChange={(val) => { setFieldValue('signup__country', val) }}
                                                        onClick={() => setFieldTouched('signup__country', true)}
                                                        onBlur={onBlur}
                                                        value={value}
                                                        className={errors.signup__country && touched.signup__country ? "input__error" : ''}
                                                        id="signup__country"
                                                    />
                                                    {errors?.signup__country && touched?.signup__country &&
                                                        <p className='login__error'>{errors?.signup__country}</p>
                                                    }
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </div>
                                <div>
                                    <label htmlFor="signup__city">City/District<span className="asterik">*</span></label>
                                    <Field name="signup__city">
                                        {({
                                            field: { onBlur, value }, // { name, value, onChange, onBlur }
                                            form: { setFieldValue, setFieldTouched, errors, touched, values }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                            meta,
                                        }) => {

                                            return (
                                                <div>
                                                    <RegionDropdown
                                                        // Pass the field's onChange and onBlur functions
                                                        onChange={(val) => { setFieldValue('signup__city', val) }}
                                                        onClick={() => setFieldTouched('signup__city', true)}
                                                        onBlur={onBlur}
                                                        value={value}
                                                        country={values.signup__country}
                                                        className={errors.signup__city && touched.signup__city ? "input__error" : ''}
                                                        id="signup__city"
                                                    />
                                                    {errors?.signup__city && touched?.signup__city &&
                                                        <p className='login__error'>{errors?.signup__city}</p>
                                                    }
                                                </div>
                                            )
                                        }}
                                    </Field>

                                </div>
                            </FormikStep>
                        ) : step === 2 ? (
                            <FormikStep>
                                <>
                                    {!isStudent ? (
                                        <>
                                            <div>
                                                <label htmlFor="signup__jobTitle">Most Recent Job Title<span className="asterik">*</span></label>
                                                <input
                                                    value={values.signup__jobTitle}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    type='text'
                                                    id='signup__jobTitle'
                                                    className={errors.signup__jobTitle && touched.signup__jobTitle ? "input__error" : ''}
                                                />
                                                {errors.signup__jobTitle && touched.signup__jobTitle &&
                                                    <p className='login__error'>{errors.signup__jobTitle}</p>
                                                }
                                            </div>
                                            <div>

                                                <label htmlFor="signup__jobType">Job Type<span className="asterik">*</span></label>
                                                <input
                                                    value={values.signup__jobType}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    type='text'
                                                    id='signup__jobType'
                                                    className={errors.signup__jobType && touched.signup__jobType ? "input__error" : ''}
                                                />
                                                {errors.signup__jobType && touched.signup__jobType &&
                                                    <p className='login__error'>{errors.signup__jobType}</p>
                                                }
                                            </div>
                                            <div>

                                                <label htmlFor="signup__company">Company Name<span className="asterik">*</span></label>
                                                <input
                                                    value={values.signup__company}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    type='text'
                                                    id='signup__company'
                                                    className={errors.signup__company && touched.signup__company ? "input__error" : ''}
                                                />
                                                {errors.signup__company && touched.signup__company &&
                                                    <p className='login__error'>{errors.signup__company}</p>
                                                }
                                            </div>
                                        </>
                                    ) : (
                                        <div className="signup__third__step">
                                            <div >
                                                <label htmlFor="signup__schoolName">School Name</label>
                                                <input
                                                    value={values.signup__schoolName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    type='text'
                                                    id='signup__schoolName'
                                                    className={errors?.signup__schoolName && touched?.signup__schoolName ? "input__error" : ''}
                                                />
                                                {errors?.signup__schoolName && touched?.signup__schoolName &&
                                                    <p className='login__error'>{errors?.signup__schoolName}</p>
                                                }
                                            </div>

                                            <div className="signup__student__dates">
                                                <div className="signup__student__date">
                                                    <label htmlFor="start__year__school">Start Year</label>
                                                    <select name="start__year__school"
                                                        value={values.start__year__school}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        id='start__year__school'
                                                        className="signup__date_select"
                                                    >
                                                        <option key="start">-</option>
                                                        {startYearOptions.map((year) => (
                                                            <option key={`${year}-start`} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="signup__student__date">
                                                    <label htmlFor="end__year__school">End Year</label>
                                                    <select name="end__year__school"
                                                        value={values.end__year__school}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        id='end__year__school'
                                                        className="signup__date_select"
                                                    >
                                                        <option key="end">-</option>
                                                        {endYearOptions.map((year) => (
                                                            <option key={`${year}-end`} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </>

                                <div>
                                    <button
                                        className="signup__student__optionBtn"
                                        type="button"
                                        //TODO: check when component loads, if you need to set isStudent state to false every time or not
                                        onClick={handleStudent}
                                    >I'm {!isStudent ? '' : 'not '} a Student</button>
                                </div>
                            </FormikStep>
                        ) : null
                        }


                        <button
                            //TODO: change it so that it should not be able to move further if all the inputs are not filled in and are not valid. Continue should also be disabled and submit should also be disabled
                            disabled={!isValid || !dirty}
                            // type={isLastStep() ? 'submit' : 'button'}
                            type="submit"
                            // onClick={() => {
                            //     if (!isLastStep()) {
                            //       setStep(step < totalSteps - 1 ? step + 1 : step);
                            //     }
                            //   }}
                            className='signup__screen__button'
                        >
                            {isDocAdding ? <SpinnerCircularFixed size={20} color="#fff" /> : isLastStep() ? 'Submit' : 'Continue'}
                        </button>

                        {/* {showError && <p className='login__error'>{errorMessage}</p>} */}

                    </form>
                </div>
            </div>
        </FormikProvider>
    )
}
export default Screen1Name

function FormikStep({ children }) {
    return <>{children}</>
}
